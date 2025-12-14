const complexityReport = require('complexity-report');

exports.calculateComplexity = (code) => {
  try {
    const report = complexityReport.run(code);
    return {
      cyclomatic: report.cyclomatic,
      halstead: report.halstead,
      maintainability: report.maintainability,
      sloc: report.sloc
    };
  } catch (error) {
    return {
      cyclomatic: 1,
      halstead: { difficulty: 0, volume: 0 },
      maintainability: 100,
      sloc: code.split('\n').length
    };
  }
};

exports.calculateReadability = (text) => {
  // Simple readability score based on various metrics
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const characters = text.replace(/\s+/g, '').length;

  if (words.length === 0 || sentences.length === 0) {
    return 100; // Empty text is perfectly readable
  }

  // Average words per sentence
  const wordsPerSentence = words.length / sentences.length;
  
  // Average syllables per word (approximation)
  const syllables = words.reduce((total, word) => {
    return total + countSyllables(word);
  }, 0);
  const syllablesPerWord = syllables / words.length;

  // Calculate Flesch Reading Ease
  const flesch = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  
  // Convert to 0-100 scale (higher is better)
  const readability = Math.min(Math.max(flesch, 0), 100);

  return Math.round(readability);
};

function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

exports.calculateMaintainabilityIndex = (complexity, sloc, comments) => {
  // Simplified maintainability index calculation
  const commentRatio = comments / (sloc + 1);
  const normalizedComplexity = Math.min(complexity / 10, 1);
  
  let score = 100;
  score -= normalizedComplexity * 30; // Complexity penalty
  score += commentRatio * 20; // Comment bonus
  score -= (sloc > 100 ? (sloc - 100) * 0.1 : 0); // Size penalty
  
  return Math.max(0, Math.min(score, 100));
};

exports.calculateTestCoverageScore = (coverageData) => {
  if (!coverageData || !coverageData.total) {
    return 0;
  }

  const { covered, total } = coverageData;
  const percentage = (covered / total) * 100;
  
  // Apply non-linear scoring (80% coverage = 90 points, 100% = 100 points)
  if (percentage >= 80) {
    return 90 + ((percentage - 80) * 0.5);
  } else if (percentage >= 50) {
    return 50 + ((percentage - 50) * 1.33);
  } else {
    return percentage * 1;
  }
};

exports.calculateCollaborationScore = (commits, prs, issues) => {
  let score = 0;

  // Multiple contributors
  if (commits.authors > 1) score += 30;
  if (commits.authors > 3) score += 20;

  // PR activity
  if (prs.total > 0) score += 20;
  if (prs.mergedRatio > 0.5) score += 15;
  if (prs.averageComments > 1) score += 10;

  // Issue activity
  if (issues.total > 0) score += 10;
  if (issues.responseTime < 7) score += 15; // Quick responses

  return Math.min(score, 100);
};