const crypto = require('crypto');

exports.generateBadges = (scores, metrics) => {
  const badges = [];

  // Overall achievement badges
  badges.push(...generateAchievementBadges(scores.overall));

  // Skill-specific badges
  badges.push(...generateSkillBadges(scores));

  // Special badges based on metrics
  badges.push(...generateSpecialBadges(metrics));

  // Unique identifier for each badge set
  const badgeHash = crypto
    .createHash('md5')
    .update(JSON.stringify(badges))
    .digest('hex')
    .substring(0, 8);

  badges.forEach(badge => {
    badge.id = `${badge.category}-${badge.level}-${badgeHash}`;
    badge.earnedAt = new Date().toISOString();
  });

  return badges;
};

function generateAchievementBadges(overallScore) {
  const badges = [];

  if (overallScore >= 90) {
    badges.push({
      name: 'Elite Repository',
      level: 'platinum',
      category: 'achievement',
      icon: '👑',
      description: 'Top-tier repository excellence',
      threshold: 90
    });
  }

  if (overallScore >= 80) {
    badges.push({
      name: 'Gold Standard',
      level: 'gold',
      category: 'achievement',
      icon: '🏆',
      description: 'Exceptional repository quality',
      threshold: 80
    });
  }

  if (overallScore >= 70) {
    badges.push({
      name: 'Silver Star',
      level: 'silver',
      category: 'achievement',
      icon: '⭐',
      description: 'High-quality repository',
      threshold: 70
    });
  }

  if (overallScore >= 60) {
    badges.push({
      name: 'Bronze Medal',
      level: 'bronze',
      category: 'achievement',
      icon: '🥉',
      description: 'Solid repository foundation',
      threshold: 60
    });
  }

  if (overallScore >= 50) {
    badges.push({
      name: 'Green Thumb',
      level: 'basic',
      category: 'achievement',
      icon: '🌱',
      description: 'Growing repository with potential',
      threshold: 50
    });
  }

  return badges;
}

function generateSkillBadges(scores) {
  const badges = [];

  // Code Quality badges
  if (scores.codeQuality >= 85) {
    badges.push({
      name: 'Code Quality Master',
      level: 'gold',
      category: 'code-quality',
      icon: '💎',
      description: 'Exceptional code quality standards',
      threshold: 85
    });
  } else if (scores.codeQuality >= 70) {
    badges.push({
      name: 'Code Quality Pro',
      level: 'silver',
      category: 'code-quality',
      icon: '⚡',
      description: 'Strong code quality practices',
      threshold: 70
    });
  }

  // Documentation badges
  if (scores.documentation >= 85) {
    badges.push({
      name: 'Documentation Guru',
      level: 'gold',
      category: 'documentation',
      icon: '📚',
      description: 'Comprehensive and clear documentation',
      threshold: 85
    });
  } else if (scores.documentation >= 70) {
    badges.push({
      name: 'Documentation Expert',
      level: 'silver',
      category: 'documentation',
      icon: '📝',
      description: 'Good documentation practices',
      threshold: 70
    });
  }

  // Testing badges
  if (scores.testing >= 85) {
    badges.push({
      name: 'Testing Champion',
      level: 'gold',
      category: 'testing',
      icon: '🧪',
      description: 'Comprehensive test coverage',
      threshold: 85
    });
  } else if (scores.testing >= 70) {
    badges.push({
      name: 'Testing Advocate',
      level: 'silver',
      category: 'testing',
      icon: '✅',
      description: 'Good testing practices',
      threshold: 70
    });
  }

  // CI/CD badges
  if (scores.ciCd >= 80) {
    badges.push({
      name: 'DevOps Expert',
      level: 'gold',
      category: 'ci-cd',
      icon: '🚀',
      description: 'Advanced CI/CD implementation',
      threshold: 80
    });
  } else if (scores.ciCd >= 60) {
    badges.push({
      name: 'Automation Pro',
      level: 'silver',
      category: 'ci-cd',
      icon: '⚙️',
      description: 'Good automation practices',
      threshold: 60
    });
  }

  // Collaboration badges
  if (scores.collaboration >= 80) {
    badges.push({
      name: 'Team Leader',
      level: 'gold',
      category: 'collaboration',
      icon: '👥',
      description: 'Excellent collaboration skills',
      threshold: 80
    });
  } else if (scores.collaboration >= 60) {
    badges.push({
      name: 'Team Player',
      level: 'silver',
      category: 'collaboration',
      icon: '🤝',
      description: 'Good collaboration practices',
      threshold: 60
    });
  }

  return badges;
}

function generateSpecialBadges(metrics) {
  const badges = [];

  // Activity badges
  if (metrics.commitFrequency > 1) {
    badges.push({
      name: 'Active Contributor',
      level: 'special',
      category: 'activity',
      icon: '🔥',
      description: 'High commit frequency',
      threshold: 1
    });
  }

  if (metrics.totalCommits > 100) {
    badges.push({
      name: 'Commit Master',
      level: 'special',
      category: 'activity',
      icon: '💪',
      description: 'Over 100 commits',
      threshold: 100
    });
  }

  // Quality badges
  if (metrics.codeSmells === 0) {
    badges.push({
      name: 'Clean Code',
      level: 'special',
      category: 'quality',
      icon: '✨',
      description: 'No code smells detected',
      threshold: 0
    });
  }

  if (metrics.testCoverage >= 90) {
    badges.push({
      name: 'Test Coverage King',
      level: 'special',
      category: 'testing',
      icon: '👑',
      description: '90%+ test coverage',
      threshold: 90
    });
  }

  // Structure badges
  if (metrics.totalFiles > 50) {
    badges.push({
      name: 'Project Scale',
      level: 'special',
      category: 'structure',
      icon: '🏗️',
      description: 'Large project structure',
      threshold: 50
    });
  }

  if (metrics.languageCount >= 3) {
    badges.push({
      name: 'Polyglot Developer',
      level: 'special',
      category: 'skills',
      icon: '🌐',
      description: 'Multiple programming languages',
      threshold: 3
    });
  }

  return badges;
}

exports.generateBadgeSVG = (badge) => {
  const colors = {
    platinum: '#E5E4E2',
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
    basic: '#4CAF50',
    special: '#9C27B0'
  };

  const color = colors[badge.level] || '#4CAF50';

  return `
    <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${badge.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}99;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="116" height="36" rx="8" fill="url(#grad${badge.id})" stroke="#333" stroke-width="1"/>
      <text x="60" y="15" text-anchor="middle" font-family="Arial" font-size="10" fill="white">${badge.icon}</text>
      <text x="60" y="30" text-anchor="middle" font-family="Arial" font-size="8" fill="white">${badge.name}</text>
    </svg>
  `;
};

exports.exportBadgesAsJSON = (badges) => {
  return {
    generatedAt: new Date().toISOString(),
    totalBadges: badges.length,
    badges: badges.map(badge => ({
      name: badge.name,
      level: badge.level,
      category: badge.category,
      description: badge.description,
      earnedAt: badge.earnedAt
    }))
  };
};