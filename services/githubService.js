const axios = require('axios');
const cheerio = require('cheerio');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoInsight-Pro'
  }
});

exports.analyzeRepositoryService = async (repoUrl) => {
  try {
    // Extract owner and repo from URL
    const urlParts = repoUrl.split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1].replace('.git', '');
    
    console.log(`Analyzing repository: ${owner}/${repo}`);
    
    // Fetch all repository data in parallel
    const [
      repoInfo,
      languages,
      commits,
      pulls,
      issues,
      contents,
      readme,
      workflows
    ] = await Promise.allSettled([
      githubAPI.get(`/repos/${owner}/${repo}`),
      githubAPI.get(`/repos/${owner}/${repo}/languages`),
      githubAPI.get(`/repos/${owner}/${repo}/commits?per_page=100`),
      githubAPI.get(`/repos/${owner}/${repo}/pulls?state=all&per_page=50`),
      githubAPI.get(`/repos/${owner}/${repo}/issues?state=all&per_page=50`),
      githubAPI.get(`/repos/${owner}/${repo}/contents`),
      githubAPI.get(`/repos/${owner}/${repo}/readme`, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' }
      }).catch(() => ({ data: '' })),
      githubAPI.get(`/repos/${owner}/${repo}/actions/workflows`)
    ]);

    // Process the data
    const repoData = repoInfo.status === 'fulfilled' ? repoInfo.value.data : {};
    const languageData = languages.status === 'fulfilled' ? languages.value.data : {};
    const commitData = commits.status === 'fulfilled' ? commits.value.data : [];
    const prData = pulls.status === 'fulfilled' ? pulls.value.data : [];
    const issueData = issues.status === 'fulfilled' ? issues.value.data : [];
    const contentData = contents.status === 'fulfilled' ? contents.value.data : [];
    const readmeContent = readme.status === 'fulfilled' ? readme.value.data : '';
    const workflowData = workflows.status === 'fulfilled' ? workflows.value.data : {};

    // Analyze repository structure
    const structure = analyzeRepositoryStructure(contentData);
    
    // Analyze commits
    const commitAnalysis = analyzeCommits(commitData);
    
    // Analyze PRs
    const prAnalysis = analyzePullRequests(prData);
    
    // Analyze README
    const readmeAnalysis = analyzeReadmeContent(readmeContent);
    
    // Check for tests
    const testAnalysis = analyzeTests(contentData);
    
    // Check for CI/CD
    const ciCdAnalysis = analyzeCICD(workflowData, contentData);

    return {
      name: repoData.name,
      owner: repoData.owner?.login,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.watchers_count,
      openIssues: repoData.open_issues_count,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      languages: Object.keys(languageData),
      languageStats: languageData,
      structure,
      commitAnalysis,
      prAnalysis,
      readmeAnalysis,
      testAnalysis,
      ciCdAnalysis,
      totalFiles: structure.totalFiles,
      totalLines: structure.totalLines,
      hasLicense: checkLicense(contentData),
      hasContributing: checkContributing(contentData)
    };
  } catch (error) {
    console.error('GitHub service error:', error.message);
    throw new Error(`Failed to analyze repository: ${error.message}`);
  }
};

function analyzeRepositoryStructure(contents) {
  let totalFiles = 0;
  let totalLines = 0;
  const fileTypes = {};
  const directories = [];

  function traverseContents(items, path = '') {
    items.forEach(item => {
      if (item.type === 'dir') {
        directories.push(item.path);
        // Note: Would need recursive fetching for complete analysis
      } else if (item.type === 'file') {
        totalFiles++;
        const extension = item.name.split('.').pop() || 'none';
        fileTypes[extension] = (fileTypes[extension] || 0) + 1;
      }
    });
  }

  traverseContents(contents);

  return {
    totalFiles,
    totalLines,
    fileTypes,
    directories,
    depth: calculateDepth(directories),
    organizationScore: calculateOrganizationScore(directories, fileTypes)
  };
}

function analyzeCommits(commits) {
  if (!commits || commits.length === 0) {
    return {
      total: 0,
      frequency: 0,
      consistency: 0,
      messageQuality: 0,
      authors: []
    };
  }

  const authors = {};
  const messages = [];
  const dates = [];

  commits.forEach(commit => {
    const author = commit.commit.author.name;
    authors[author] = (authors[author] || 0) + 1;
    messages.push(commit.commit.message);
    dates.push(new Date(commit.commit.author.date));
  });

  // Calculate commit frequency
  const sortedDates = dates.sort((a, b) => a - b);
  const timeSpan = sortedDates[sortedDates.length - 1] - sortedDates[0];
  const days = timeSpan / (1000 * 60 * 60 * 24);
  const frequency = days > 0 ? commits.length / days : commits.length;

  // Analyze commit message quality
  const messageQuality = analyzeCommitMessages(messages);

  return {
    total: commits.length,
    frequency,
    consistency: calculateConsistency(dates),
    messageQuality,
    authors: Object.keys(authors),
    primaryAuthor: Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b),
    timeline: dates.map(d => d.toISOString().split('T')[0])
  };
}

function analyzeCommitMessages(messages) {
  const scores = messages.map(msg => {
    let score = 0;
    
    // Check message length
    if (msg.length > 10) score += 20;
    if (msg.length > 30) score += 20;
    
    // Check for issue references
    if (/#\d+/.test(msg) || /fix/i.test(msg) || /feat/i.test(msg)) score += 20;
    
    // Check for conventional commits format
    if (/^(feat|fix|docs|style|refactor|test|chore):/.test(msg)) score += 40;
    
    return Math.min(score, 100);
  });

  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
}

function analyzePullRequests(prs) {
  if (!prs || prs.length === 0) {
    return {
      total: 0,
      merged: 0,
      open: 0,
      averageComments: 0,
      averageReviewTime: 0,
      averageSize: 0
    };
  }

  const mergedPRs = prs.filter(pr => pr.merged_at);
  const openPRs = prs.filter(pr => pr.state === 'open');
  
  const reviewTimes = mergedPRs.map(pr => {
    const created = new Date(pr.created_at);
    const merged = new Date(pr.merged_at);
    return (merged - created) / (1000 * 60 * 60 * 24); // in days
  });

  const averageReviewTime = reviewTimes.length > 0 
    ? reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length 
    : 0;

  const averageComments = prs.length > 0
    ? prs.reduce((sum, pr) => sum + pr.comments, 0) / prs.length
    : 0;

  return {
    total: prs.length,
    merged: mergedPRs.length,
    open: openPRs.length,
    mergedRatio: prs.length > 0 ? mergedPRs.length / prs.length : 0,
    averageComments,
    averageReviewTime,
    averageSize: calculateAveragePRSize(prs)
  };
}

function calculateAveragePRSize(prs) {
  if (prs.length === 0) return 0;
  
  const sizes = prs.map(pr => {
    const additions = pr.additions || 0;
    const deletions = pr.deletions || 0;
    const changedFiles = pr.changed_files || 0;
    return (additions + deletions) * 0.5 + changedFiles * 10;
  });
  
  return sizes.reduce((a, b) => a + b, 0) / sizes.length;
}

function analyzeReadmeContent(readme) {
  if (!readme || readme.trim().length === 0) {
    return {
      exists: false,
      score: 0,
      sections: {},
      wordCount: 0,
      hasCodeExamples: false,
      hasImages: false,
      hasBadges: false
    };
  }

  const $ = cheerio.load(readme);
  const text = $('body').text();
  
  const sections = {
    title: text.includes('# ') ? 1 : 0,
    description: text.length > 100 ? 1 : 0,
    installation: /install|setup|getting started/i.test(text) ? 1 : 0,
    usage: /usage|example|demo/i.test(text) ? 1 : 0,
    api: /api|endpoint|route/i.test(text) ? 1 : 0,
    configuration: /config|setting|env/i.test(text) ? 1 : 0,
    testing: /test|spec|coverage/i.test(text) ? 1 : 0,
    contributing: /contribut|pull request|pr/i.test(text) ? 1 : 0,
    license: /license|licence/i.test(text) ? 1 : 0,
    faq: /faq|question|troubleshoot/i.test(text) ? 1 : 0
  };

  const score = Object.values(sections).filter(v => v === 1).length * 10;
  const hasCodeExamples = $('code').length > 0;
  const hasImages = $('img').length > 0;
  const hasBadges = /badge|status|coverage|version/.test(text);
  const hasLinks = $('a').length > 5;

  return {
    exists: true,
    score: Math.min(score, 100),
    sections,
    wordCount: text.split(/\s+/).length,
    hasCodeExamples,
    hasImages,
    hasBadges,
    hasLinks,
    quality: calculateReadmeQuality(text, $)
  };
}

function calculateReadmeQuality(text, $) {
  let quality = 0;
  
  // Structure
  const headings = $('h1, h2, h3, h4, h5, h6').length;
  if (headings >= 3) quality += 20;
  
  // Code blocks
  const codeBlocks = $('pre code').length;
  if (codeBlocks >= 1) quality += 20;
  
  // Links
  const links = $('a').length;
  if (links >= 3) quality += 20;
  
  // Length
  const words = text.split(/\s+/).length;
  if (words >= 300) quality += 20;
  if (words >= 500) quality += 20;
  
  return Math.min(quality, 100);
}

function analyzeTests(contents) {
  let testFiles = 0;
  let testDirs = 0;
  let hasTestConfig = false;
  let coverageConfig = false;
  
  function checkItem(item) {
    const name = item.name.toLowerCase();
    const path = item.path.toLowerCase();
    
    if (name.includes('test') || name.includes('spec')) {
      if (item.type === 'dir') testDirs++;
      else if (item.type === 'file') testFiles++;
    }
    
    if (name.includes('jest') || name.includes('mocha') || name.includes('pytest')) {
      hasTestConfig = true;
    }
    
    if (name.includes('coverage') || name.includes('.nycrc') || name.includes('codecov')) {
      coverageConfig = true;
    }
  }
  
  contents.forEach(checkItem);
  
  return {
    hasTests: testFiles > 0,
    testFiles,
    testDirs,
    hasTestConfig,
    coverageConfig,
    testScore: calculateTestScore(testFiles, hasTestConfig, coverageConfig)
  };
}

function calculateTestScore(testFiles, hasTestConfig, coverageConfig) {
  let score = 0;
  if (testFiles > 0) score += 40;
  if (testFiles > 5) score += 20;
  if (hasTestConfig) score += 20;
  if (coverageConfig) score += 20;
  return Math.min(score, 100);
}

function analyzeCICD(workflows, contents) {
  const hasWorkflows = workflows.workflows && workflows.workflows.length > 0;
  let configFiles = 0;
  
  contents.forEach(item => {
    const name = item.name.toLowerCase();
    if (name.includes('github') && name.includes('workflow')) configFiles++;
    if (name.includes('dockerfile')) configFiles++;
    if (name.includes('docker-compose')) configFiles++;
    if (name.includes('.travis')) configFiles++;
    if (name.includes('jenkins')) configFiles++;
    if (name.includes('gitlab')) configFiles++;
  });
  
  return {
    hasCI: hasWorkflows || configFiles > 0,
    workflowCount: workflows.workflows?.length || 0,
    configFiles,
    score: calculateCICDScore(hasWorkflows, configFiles)
  };
}

function calculateCICDScore(hasWorkflows, configFiles) {
  let score = 0;
  if (hasWorkflows) score += 50;
  if (configFiles > 0) score += 30;
  if (configFiles > 1) score += 20;
  return Math.min(score, 100);
}

function checkLicense(contents) {
  return contents.some(item => 
    item.name.toLowerCase().includes('license') || 
    item.name.toLowerCase().includes('licence')
  );
}

function checkContributing(contents) {
  return contents.some(item => 
    item.name.toLowerCase().includes('contributing') ||
    item.name.toLowerCase().includes('contribute')
  );
}

function calculateDepth(directories) {
  if (directories.length === 0) return 0;
  
  const depths = directories.map(dir => dir.split('/').length);
  return Math.max(...depths);
}

function calculateOrganizationScore(directories, fileTypes) {
  let score = 0;
  
  // Points for having standard directories
  const standardDirs = ['src', 'lib', 'test', 'tests', 'docs', 'public', 'app'];
  standardDirs.forEach(dir => {
    if (directories.includes(dir) || directories.some(d => d.includes(dir))) {
      score += 10;
    }
  });
  
  // Points for organized file types
  const organized = ['js', 'ts', 'py', 'java', 'rb', 'go', 'rs'].some(ext => fileTypes[ext]);
  if (organized) score += 30;
  
  // Penalty for too many top-level files
  const topLevelFiles = Object.values(fileTypes).reduce((a, b) => a + b, 0);
  if (topLevelFiles > 20) score -= 20;
  
  return Math.max(0, Math.min(score, 100));
}

function calculateConsistency(dates) {
  if (dates.length < 2) return 100;
  
  const sortedDates = dates.sort((a, b) => a - b);
  const intervals = [];
  
  for (let i = 1; i < sortedDates.length; i++) {
    intervals.push(sortedDates[i] - sortedDates[i - 1]);
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, interval) => {
    return sum + Math.pow(interval - avgInterval, 2);
  }, 0) / intervals.length;
  
  const stdDev = Math.sqrt(variance);
  const consistency = 100 - (stdDev / avgInterval * 100);
  
  return Math.max(0, Math.min(consistency, 100));
}