const OpenAI = require('openai');
const Analysis = require('../models/Analysis');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const prompt = `Analyze the following ${language} code for:
    1. Code quality
    2. Potential bugs
    3. Security vulnerabilities
    4. Performance issues
    5. Best practices compliance
    6. Readability and maintainability
    
    Code:
    ${code}
    
    Provide analysis in JSON format with scores (0-100) and specific recommendations.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer and software architect. Provide detailed, actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed',
      error: error.message
    });
  }
};

exports.suggestImprovements = async (req, res) => {
  try {
    const { code, language, context } = req.body;
    
    const prompt = `Suggest specific improvements for this ${language} code. Context: ${context}
    
    Code:
    ${code}
    
    Provide suggestions in this format:
    1. [Priority: High/Medium/Low] [Category] - [Suggestion]
    Include code examples for each suggestion.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer providing code improvement suggestions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    });

    res.json({
      success: true,
      data: {
        suggestions: completion.choices[0].message.content.split('\n').filter(line => line.trim()),
        raw: completion.choices[0].message.content
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate suggestions',
      error: error.message
    });
  }
};

exports.generateRoadmap = async (req, res) => {
  try {
    const { analysisId, focusAreas } = req.body;
    
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    const prompt = `Based on the following repository analysis, generate a personalized learning roadmap:
    
    Repository: ${analysis.repositoryData.name}
    Overall Score: ${analysis.scores.overall}/100
    Strengths: ${analysis.aiAnalysis.strengths?.join(', ') || 'None'}
    Weaknesses: ${analysis.aiAnalysis.weaknesses?.join(', ') || 'None'}
    Focus Areas Requested: ${focusAreas?.join(', ') || 'General improvement'}
    
    Generate a 4-week roadmap with:
    1. Week-by-week learning objectives
    2. Specific skills to improve
    3. Practice exercises
    4. Recommended resources (articles, tutorials, courses)
    5. Project ideas to apply skills
    6. Success metrics
    
    Format as a JSON object with weekly breakdowns.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a technical mentor creating personalized learning paths for developers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2500
    });

    const roadmap = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: error.message
    });
  }
};

exports.extractSkills = async (req, res) => {
  try {
    const { repositoryData, codeSamples } = req.body;
    
    const prompt = `Extract technical skills from this repository analysis:
    
    Repository Data: ${JSON.stringify(repositoryData)}
    Code Samples: ${codeSamples?.slice(0, 3).join('\n---\n') || 'No code samples'}
    
    Extract skills in these categories:
    1. Programming Languages
    2. Frameworks & Libraries
    3. Tools & Platforms
    4. Development Practices
    5. Architecture Patterns
    6. Soft Skills (if evident from commit messages or documentation)
    
    For each skill, provide:
    - Skill name
    - Confidence level (High/Medium/Low)
    - Evidence from repository
    - Suggested skill level (Beginner/Intermediate/Advanced)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a technical recruiter extracting skills from code repositories."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const skills = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to extract skills',
      error: error.message
    });
  }
};