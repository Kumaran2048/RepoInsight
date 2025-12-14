const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection (optional for now)
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB connected'));

// Simple routes for testing
app.get('/', (req, res) => {
  res.json({ message: 'RepoInsight API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock analysis endpoint
app.post('/api/analyze', (req, res) => {
  const { repositoryUrl } = req.body;
  
  if (!repositoryUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  // Simulate analysis
  const mockAnalysis = {
    id: 'mock_' + Date.now(),
    url: repositoryUrl,
    score: Math.floor(Math.random() * 30) + 70, // 70-100
    badges: ['Code Quality', 'Documentation'],
    metrics: {
      codeQuality: 85,
      documentation: 72,
      testing: 65,
      ciCd: 45
    },
    analysis: {
      strengths: ['Clean code structure', 'Good documentation'],
      weaknesses: ['Low test coverage', 'Missing CI/CD'],
      recommendations: ['Add unit tests', 'Setup GitHub Actions']
    }
  };

  setTimeout(() => {
    res.json({
      success: true,
      message: 'Analysis completed',
      data: mockAnalysis
    });
  }, 2000); // 2 second delay to simulate processing
});

// GitHub info endpoint
app.get('/api/github/:owner/:repo', (req, res) => {
  const { owner, repo } = req.params;
  
  res.json({
    success: true,
    data: {
      name: repo,
      owner: owner,
      description: 'A sample repository for testing',
      stars: 1234,
      forks: 567,
      language: 'JavaScript'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});