const Analysis = require('../models/Analysis');
const User = require('../models/User');
const { analyzeRepositoryService } = require('../services/githubService');
const { generateRoadmap } = require('../services/openaiService');
const { calculateScores, generateBadges } = require('../services/analysisService');
const { generatePDF } = require('../utils/pdfGenerator');

exports.analyzeRepository = async (req, res) => {
  try {
    const { repositoryUrl, compareWith } = req.body;
    const userId = req.user.id;

    // Start analysis
    const analysisStartTime = Date.now();
    
    // Fetch and analyze repository
    const repoData = await analyzeRepositoryService(repositoryUrl);
    
    // Calculate scores
    const scores = await calculateScores(repoData);
    
    // Generate badges
    const badges = generateBadges(scores);
    
    // Generate AI analysis
    const aiAnalysis = await generateRoadmap(repoData, scores);
    
    // Prepare visualizations
    const visualizations = {
      languageDistribution: repoData.languages,
      commitTimeline: repoData.commits?.timeline || [],
      complexityChart: repoData.complexityMetrics,
      healthMeter: {
        overall: scores.overall,
        breakdown: scores
      }
    };
    
    // Save analysis to database
    const analysis = new Analysis({
      userId,
      repositoryUrl,
      repositoryData: {
        name: repoData.name,
        owner: repoData.owner,
        description: repoData.description,
        stars: repoData.stars,
        forks: repoData.forks,
        languages: repoData.languages,
        createdAt: repoData.createdAt,
        updatedAt: repoData.updatedAt
      },
      scores,
      badges,
      metrics: {
        totalFiles: repoData.totalFiles,
        totalLines: repoData.totalLines,
        averageComplexity: repoData.averageComplexity,
        codeSmells: repoData.codeSmells?.length || 0,
        testCoverage: repoData.testCoverage,
        documentationCoverage: repoData.documentationCoverage,
        commitFrequency: repoData.commitFrequency,
        prMergeTime: repoData.prMergeTime,
        issueResponseTime: repoData.issueResponseTime
      },
      aiAnalysis,
      visualizations,
      analysisDuration: Date.now() - analysisStartTime
    });

    await analysis.save();
    
    // Update user streak
    await User.findByIdAndUpdate(userId, { $set: { 'streak.lastAnalysis': new Date() } });

    res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: analysis,
      reportUrl: `/api/export/pdf/${analysis._id}`
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message
    });
  }
};

exports.getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analyses',
      error: error.message
    });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis',
      error: error.message
    });
  }
};

exports.compareRepositories = async (req, res) => {
  try {
    const { repo1, repo2 } = req.body;
    
    // Analyze both repositories
    const [analysis1, analysis2] = await Promise.all([
      analyzeRepositoryService(repo1),
      analyzeRepositoryService(repo2)
    ]);

    const scores1 = await calculateScores(analysis1);
    const scores2 = await calculateScores(analysis2);

    const comparison = {
      repo1: { data: analysis1, scores: scores1 },
      repo2: { data: analysis2, scores: scores2 },
      differences: {
        overall: scores1.overall - scores2.overall,
        strengths: [],
        weaknesses: []
      }
    };

    // Generate comparison insights
    if (scores1.overall > scores2.overall) {
      comparison.differences.strengths = analysis1.strengths || [];
      comparison.differences.weaknesses = analysis2.weaknesses || [];
    } else {
      comparison.differences.strengths = analysis2.strengths || [];
      comparison.differences.weaknesses = analysis1.weaknesses || [];
    }

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Comparison failed',
      error: error.message
    });
  }
};

exports.exportToPDF = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    const pdfBuffer = await generatePDF(analysis.generateReportData());
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=repo-analysis-${analysis._id}.pdf`
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'PDF generation failed',
      error: error.message
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [analyses, user] = await Promise.all([
      Analysis.find({ userId }).sort({ createdAt: -1 }).limit(5),
      User.findById(userId).select('badges streak')
    ]);

    const stats = {
      totalAnalyses: analyses.length,
      averageScore: analyses.reduce((acc, curr) => acc + curr.scores.overall, 0) / analyses.length || 0,
      badgesEarned: user.badges.length,
      currentStreak: user.streak.current,
      recentAnalyses: analyses
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};