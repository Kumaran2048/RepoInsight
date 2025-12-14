// GitHub API service
const GITHUB_API = 'https://api.github.com'

export const githubAPI = {
  // Mock function to simulate GitHub API calls
  getRepositoryInfo: async (owner, repo) => {
    // In real app, make actual GitHub API call
    return {
      name: repo,
      owner: owner,
      description: 'A sample repository',
      stars: 1234,
      forks: 567,
      language: 'JavaScript',
      createdAt: '2023-01-01',
      updatedAt: '2024-01-01'
    }
  },
  
  // Validate GitHub URL
  validateGitHubUrl: (url) => {
    const githubRegex = /^https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+(?:\/)?$/
    return githubRegex.test(url)
  },
  
  // Extract owner and repo from URL
  extractRepoInfo: (url) => {
    const parts = url.split('/')
    return {
      owner: parts[parts.length - 2],
      repo: parts[parts.length - 1].replace('.git', '')
    }
  }
}