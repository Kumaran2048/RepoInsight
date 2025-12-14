const axios = require('axios');
const cheerio = require('cheerio');
const Analysis = require('../models/Analysis');

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// GitHub API instance
const githubAPI = axios.create({
  baseURL: GITHUB_API,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoInsight-Pro'
  }
});

exports.analyzeRepository = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    // Extract owner and repo from URL
    const urlParts = repoUrl.split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1].replace('.git', '');
    
    // Fetch repository data
    const [repoData, languages, commits, pulls, issues] = await Promise.all([
      githubAPI.get(`/repos/${owner}/${repo}`),
      githubAPI.get(`/repos/${owner}/${repo}/languages`),
      githubAPI.get(`/repos/${owner}/${repo}/commits?per_page=100`),
      githubAPI.get(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`),
      githubAPI.get(`/repos/${owner}/${repo}/issues?state=all&per_page=100`)
    ]);

    // Analyze README
    const readmeData = await analyzeReadme(owner, repo);
    
    // Calculate metrics
    const metrics = {
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      watchers: repoData.data.watchers_count,
      openIssues: repoData.data.open_issues_count,
      size: repoData.data.size,
      languages: Object.keys(languages.data),
      languageStats: languages.data,
      totalCommits: commits.data.length,
      totalPRs: pulls.data.length,
      totalIssues: issues.data.length,
      hasLicense: !!repoData.data.license,
      hasWiki: repoData.data.has_wiki,
      hasProjects: repoData.data.has_projects,
      readmeScore: readmeData.score,
      readmeSections: readmeData.sections
    };

    // Calculate commit frequency
    const commitDates = commits.data.map(c => new Date(c.commit.author.date));
    const commitFrequency = calculateCommitFrequency(commitDates);
    
    // Calculate PR merge time
    const prMergeTime = calculatePRMergeTime(pulls.data);
    
    // Calculate issue response time
    const issueResponseTime = calculateIssueResponseTime(issues.data);

    res.json({
      success: true,
      data: {
        ...repoData.data,
        metrics,
        commitFrequency,
        prMergeTime,
        issueResponseTime,
        readmeAnalysis: readmeData
      }
    });
  } catch (error) {
    console.error('GitHub analysis error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze repository',
      error: error.message
    });
  }
};

async function analyzeReadme(owner, repo) {
  try {
    const response = await githubAPI.get(`/repos/${owner}/${repo}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3.raw' }
    });
    
    const readmeContent = response.data;
    const $ = cheerio.load(readmeContent);
    const text = $('body').text();
    
    const sections = {
      title: text.includes('# ') ? 10 : 0,
      description: text.length > 100 ? 10 : 0,
      installation: text.toLowerCase().includes('install') ? 15 : 0,
      usage: text.toLowerCase().includes('usage') || text.toLowerCase().includes('example') ? 15 : 0,
      features: text.toLowerCase().includes('feature') ? 10 : 0,
      configuration: text.toLowerCase().includes('config') ? 10 : 0,
      contributing: text.toLowerCase().includes('contribut') ? 10 : 0,
      license: text.toLowerCase().includes('license') ? 10 : 0,
      tests: text.toLowerCase().includes('test') ? 10 : 0,
      badges: text.includes('badge') || text.includes('status') ? 10 : 0
    };
    
    const score = Object.values(sections).reduce((a, b) => a + b, 0);
    
    return {
      score,
      sections,
      hasInstallation: sections.installation > 0,
      hasUsage: sections.usage > 0,
      hasTests: sections.tests > 0,
      wordCount: text.split(/\s+/).length
    };
  } catch (error) {
    return { score: 0, sections: {}, wordCount: 0 };
  }
}

function calculateCommitFrequency(commitDates) {
  if (commitDates.length < 2) return 0;
  
  const sortedDates = commitDates.sort((a, b) => a - b);
  const timeDiff = sortedDates[sortedDates.length - 1] - sortedDates[0];
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
  return commitDates.length / Math.max(daysDiff, 1);
}

function calculatePRMergeTime(pulls) {
  const mergedPRs = pulls.filter(pr => pr.merged_at);
  if (mergedPRs.length === 0) return 0;
  
  const totalTime = mergedPRs.reduce((sum, pr) => {
    const createdAt = new Date(pr.created_at);
    const mergedAt = new Date(pr.merged_at);
    return sum + (mergedAt - createdAt);
  }, 0);
  
  return totalTime / mergedPRs.length / (1000 * 60 * 60 * 24); // in days
}

function calculateIssueResponseTime(issues) {
  const respondedIssues = issues.filter(issue => issue.comments > 0);
  if (respondedIssues.length === 0) return 0;
  
  // This is simplified - would need comment timestamps for accurate calculation
  return 1; // placeholder
}

exports.getUserRepositories = async (req, res) => {
  try {
    const response = await githubAPI.get('/user/repos', {
      params: {
        per_page: 100,
        sort: 'updated',
        direction: 'desc'
      }
    });
    
    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      private: repo.private
    }));
    
    res.json({
      success: true,
      count: repos.length,
      data: repos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repositories',
      error: error.message
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;
    
    // Handle different GitHub events
    switch (event) {
      case 'push':
        console.log('Push event received:', payload.repository.full_name);
        // Trigger re-analysis or update cache
        break;
      case 'pull_request':
        console.log('PR event:', payload.action);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }
    
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
};