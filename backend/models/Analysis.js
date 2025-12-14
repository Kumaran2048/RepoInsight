const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  repositoryUrl: {
    type: String,
    required: true,
    trim: true
  },
  repositoryData: {
    name: String,
    owner: String,
    description: String,
    stars: Number,
    forks: Number,
    languages: [String],
    createdAt: Date,
    updatedAt: Date
  },
  scores: {
    overall: { type: Number, min: 0, max: 100 },
    codeQuality: { type: Number, min: 0, max: 100 },
    documentation: { type: Number, min: 0, max: 100 },
    testing: { type: Number, min: 0, max: 100 },
    ciCd: { type: Number, min: 0, max: 100 },
    maintainability: { type: Number, min: 0, max: 100 },
    collaboration: { type: Number, min: 0, max: 100 }
  },
  badges: [{
    name: String,
    level: String,
    category: String,
    icon: String
  }],
  metrics: {
    totalFiles: Number,
    totalLines: Number,
    averageComplexity: Number,
    codeSmells: Number,
    testCoverage: Number,
    documentationCoverage: Number,
    commitFrequency: Number,
    prMergeTime: Number,
    issueResponseTime: Number
  },
  aiAnalysis: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    summary: String,
    roadmap: [{
      step: String,
      priority: String,
      estimatedTime: String,
      resources: [String]
    }]
  },
  visualizations: {
    languageDistribution: Object,
    commitTimeline: Object,
    complexityChart: Object,
    healthMeter: Object
  },
  comparisonData: {
    comparedWith: String,
    scoreDifference: Number,
    improvements: [String]
  },
  reportUrl: String,
  analysisDuration: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ 'scores.overall': -1 });
analysisSchema.index({ repositoryUrl: 1 });

// Static method for getting user's analysis history
analysisSchema.statics.getUserHistory = async function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('repositoryUrl scores.overall badges createdAt')
    .lean();
};

// Method to generate report data
analysisSchema.methods.generateReportData = function() {
  return {
    repository: this.repositoryData,
    scores: this.scores,
    badges: this.badges,
    analysis: this.aiAnalysis,
    metrics: this.metrics,
    generatedAt: this.createdAt
  };
};

module.exports = mongoose.model('Analysis', analysisSchema);