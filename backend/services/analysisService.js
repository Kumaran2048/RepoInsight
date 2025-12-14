const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

exports.calculateScores = async (repoData) => {
  const scores = {
    overall: 0,
    codeQuality: 0,
    documentation: 0,
    testing: 0,
    ciCd: 0,
    maintainability: 0,
    collaboration: 0,
    performance: 0,
    security: 0
  };

  // Code Quality (25%)
  scores.codeQuality = calculateCodeQualityScore(repoData);
  
  // Documentation (15%)
  scores.documentation = calculateDocumentationScore(repoData);
  
  // Testing (15%)
  scores.testing = calculateTestingScore(repoData);
  
  // CI/CD (10%)
  scores.ciCd = calculateCICDScore(repoData);
  
  // Maintainability (15%)
  scores.maintainability = calculateMaintainabilityScore(repoData);
  
  // Collaboration (10%)
  scores.collaboration = calculateCollaborationScore(repoData);
  
  // Performance (5%)
  scores.performance = calculatePerformanceScore(repoData);
  
  // Security (5%)
  scores.security = calculateSecurityScore(repoData);

  // Calculate weighted overall score
  const weights = {
    codeQuality: 0.25,
    documentation: 0.15,
    testing: 0.15,
    ciCd: 0.10,
    maintainability: 0.15,
    collaboration: 0.10,
    performance: 0.05,
    security: 0.05
  };

  scores.overall = Object.keys(weights).reduce((total, key) => {
    return total + (scores[key] * weights[key]);
  }, 0);

  // Round all scores
  Object.keys(scores).forEach(key => {
    scores[key] = Math.round(scores[key]);
  });

  return scores;
};

function calculateCodeQualityScore(repoData) {
  let score = 50; // Base score

  // Language diversity (moderate is good)
  const languageCount = repoData.languages?.length || 0;
  if (languageCount === 1) score += 10; // Focused
  else if (languageCount <= 3) score += 15; // Good balance
  else if (languageCount > 5) score -= 10; // Too fragmented

  // Repository structure
  if (repoData.structure?.organizationScore) {
    score += repoData.structure.organizationScore * 0.3;
  }

  // Commit message quality
  if (repoData.commitAnalysis?.messageQuality) {
    score += repoData.commitAnalysis.messageQuality * 0.2;
  }

  // PR quality
  if (repoData.prAnalysis?.mergedRatio > 0.7) score += 10;
  if (repoData.prAnalysis?.averageComments > 1) score += 5;

  return Math.min(Math.max(score, 0), 100);
}

function calculateDocumentationScore(repoData) {
  let score = 0;

  // README score
  if (repoData.readmeAnalysis?.score) {
    score += repoData.readmeAnalysis.score * 0.7;
  }

  // Has license
  if (repoData.hasLicense) score += 10;

  // Has contributing guide
  if (repoData.hasContributing) score += 10;

  // Code comments (estimated - would need actual code analysis)
  score += 10; // Placeholder

  // Wiki
  if (repoData.hasWiki) score += 5;

  return Math.min(score, 100);
}

function calculateTestingScore(repoData) {
  let score = 0;

  if (repoData.testAnalysis) {
    // Test existence
    if (repoData.testAnalysis.hasTests) score += 40;
    
    // Test configuration
    if (repoData.testAnalysis.hasTestConfig) score += 30;
    
    // Coverage configuration
    if (repoData.testAnalysis.coverageConfig) score += 30;
    
    // Multiple test files
    if (repoData.testAnalysis.testFiles > 5) score += 20;
  }

  return Math.min(score, 100);
}

function calculateCICDScore(repoData) {
  let score = 0;

  if (repoData.ciCdAnalysis) {
    score = repoData.ciCdAnalysis.score;
  }

  // Additional points for multiple workflows
  if (repoData.ciCdAnalysis?.workflowCount > 1) {
    score = Math.min(score + 20, 100);
  }

  return score;
}

function calculateMaintainabilityScore(repoData) {
  let score = 50;

  // Recent activity
  const updatedAt = new Date(repoData.updatedAt);
  const now = new Date();
  const daysSinceUpdate = (now - updatedAt) / (1000 * 60 * 60 * 24);
  
  if (daysSinceUpdate < 30) score += 20; // Recently updated
  else if (daysSinceUpdate < 90) score += 10; // Updated within 3 months
  else if (daysSinceUpdate > 365) score -= 20; // Stale

  // Issue response (placeholder)
  score += 10;

  // Dependencies (would need package.json analysis)
  score += 10;

  return Math.min(Math.max(score, 0), 100);
}

function calculateCollaborationScore(repoData) {
  let score = 0;

  // Multiple contributors
  if (repoData.commitAnalysis?.authors) {
    const authorCount = repoData.commitAnalysis.authors.length;
    if (authorCount > 1) score += 20;
    if (authorCount > 3) score += 20;
  }

  // PR activity
  if (repoData.prAnalysis) {
    if (repoData.prAnalysis.total > 0) score += 20;
    if (repoData.prAnalysis.mergedRatio > 0.5) score += 20;
    if (repoData.prAnalysis.averageComments > 0) score += 10;
  }

  // Issue discussion
  if (repoData.openIssues > 0) score += 10;

  return Math.min(score, 100);
}

function calculatePerformanceScore(repoData) {
  // Placeholder - would need actual performance analysis
  let score = 60;

  // Size considerations
  if (repoData.size && repoData.size < 10000) score += 20;
  if (repoData.structure?.totalFiles && repoData.structure.totalFiles < 100) score += 10;

  // Language-specific optimizations (placeholder)
  const langs = repoData.languages || [];
  if (langs.includes('Rust') || langs.includes('Go')) score += 10;
  if (langs.includes('Python') && !langs.includes('C++')) score -= 5;

  return Math.min(Math.max(score, 0), 100);
}

function calculateSecurityScore(repoData) {
  // Placeholder - would need security scanning
  let score = 70;

  // Has security policies
  // Has dependency management
  // Has security scanning in CI

  return Math.min(score, 100);
}

exports.generateBadges = (scores) => {
  const badges = [];

  // Overall badge
  badges.push(generateOverallBadge(scores.overall));

  // Skill badges based on scores
  if (scores.codeQuality >= 80) {
    badges.push({
      name: 'Code Quality Expert',
      level: 'Gold',
      category: 'quality',
      icon: '🏆',
      description: 'Exceptional code quality standards'
    });
  } else if (scores.codeQuality >= 60) {
    badges.push({
      name: 'Code Quality Pro',
      level: 'Silver',
      category: 'quality',
      icon: '🥈',
      description: 'Strong code quality practices'
    });
  }

  if (scores.documentation >= 80) {
    badges.push({
      name: 'Documentation Master',
      level: 'Gold',
      category: 'docs',
      icon: '📚',
      description: 'Excellent documentation practices'
    });
  }

  if (scores.testing >= 80) {
    badges.push({
      name: 'Testing Champion',
      level: 'Gold',
      category: 'testing',
      icon: '🧪',
      description: 'Comprehensive testing coverage'
    });
  }

  if (scores.ciCd >= 70) {
    badges.push({
      name: 'CI/CD Pioneer',
      level: 'Silver',
      category: 'devops',
      icon: '⚡',
      description: 'Advanced CI/CD implementation'
    });
  }

  if (scores.collaboration >= 70) {
    badges.push({
      name: 'Team Player',
      level: 'Silver',
      category: 'collaboration',
      icon: '👥',
      description: 'Strong collaboration skills'
    });
  }

  // Special badges
  if (scores.overall >= 90) {
    badges.push({
      name: 'Repository Excellence',
      level: 'Platinum',
      category: 'overall',
      icon: '💎',
      description: 'Top-tier repository standards'
    });
  }

  if (scores.overall >= 75 && scores.overall < 90) {
    badges.push({
      name: 'Quality Maintainer',
      level: 'Gold',
      category: 'overall',
      icon: '⭐',
      description: 'High-quality repository maintenance'
    });
  }

  return badges;
};

function generateOverallBadge(score) {
  if (score >= 90) {
    return {
      name: 'Elite Developer',
      level: 'Platinum',
      category: 'overall',
      icon: '👑',
      description: 'Top 10% of repositories'
    };
  } else if (score >= 75) {
    return {
      name: 'Advanced Developer',
      level: 'Gold',
      category: 'overall',
      icon: '🥇',
      description: 'Top 25% of repositories'
    };
  } else if (score >= 60) {
    return {
      name: 'Proficient Developer',
      level: 'Silver',
      category: 'overall',
      icon: '🥈',
      description: 'Above average repository quality'
    };
  } else if (score >= 40) {
    return {
      name: 'Developing Developer',
      level: 'Bronze',
      category: 'overall',
      icon: '🥉',
      description: 'Good foundation with room for improvement'
    };
  } else {
    return {
      name: 'Beginner Developer',
      level: 'Basic',
      category: 'overall',
      icon: '🌱',
      description: 'Starting the development journey'
    };
  }
}

exports.generateAIInsights = async (repoData, scores) => {
  const insights = {
    strengths: [],
    weaknesses: [],
    recommendations: [],
    summary: '',
    priority: 'medium'
  };

  // Generate strengths
  if (scores.codeQuality >= 70) {
    insights.strengths.push('Strong code quality and structure');
  }
  if (scores.documentation >= 70) {
    insights.strengths.push('Comprehensive documentation');
  }
  if (scores.testing >= 70) {
    insights.strengths.push('Good testing practices');
  }
  if (scores.collaboration >= 70) {
    insights.strengths.push('Effective team collaboration');
  }

  // Generate weaknesses
  if (scores.codeQuality < 50) {
    insights.weaknesses.push('Code quality needs improvement');
  }
  if (scores.documentation < 50) {
    insights.weaknesses.push('Documentation is lacking');
  }
  if (scores.testing < 50) {
    insights.weaknesses.push('Testing coverage is insufficient');
  }
  if (scores.ciCd < 40) {
    insights.weaknesses.push('CI/CD pipeline could be improved');
  }

  // Generate recommendations
  if (scores.testing < 60) {
    insights.recommendations.push('Add unit tests for critical functions');
    insights.recommendations.push('Set up test coverage reporting');
  }
  if (scores.documentation < 60) {
    insights.recommendations.push('Improve README with usage examples');
    insights.recommendations.push('Add code comments for complex logic');
  }
  if (scores.ciCd < 50) {
    insights.recommendations.push('Set up GitHub Actions for CI');
    insights.recommendations.push('Add automated deployment');
  }

  // Generate summary
  if (scores.overall >= 80) {
    insights.summary = 'This is a well-maintained repository with strong development practices. Keep up the good work!';
    insights.priority = 'low';
  } else if (scores.overall >= 60) {
    insights.summary = 'Good foundation with several areas of strength. Focus on the recommendations to reach the next level.';
    insights.priority = 'medium';
  } else {
    insights.summary = 'This repository has potential but needs significant improvements in key areas. Start with the high-priority recommendations.';
    insights.priority = 'high';
  }

  return insights;
};