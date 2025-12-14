import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  StarIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  BeakerIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const Analysis = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [repoUrl, setRepoUrl] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const repoParam = queryParams.get('repo')
    if (repoParam) {
      setRepoUrl(decodeURIComponent(repoParam))
      handleAnalyze(decodeURIComponent(repoParam))
    }
  }, [location])

  const handleAnalyze = async (url) => {
    if (!url) {
      toast.error('Please enter a repository URL')
      return
    }

    setLoading(true)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      // Mock analysis data - replace with actual API call
      setTimeout(() => {
        clearInterval(progressInterval)
        setProgress(100)
        
        const mockAnalysis = {
          _id: 'mock123',
          repositoryUrl: url,
          repositoryData: {
            name: url.split('/').pop(),
            owner: url.split('/')[3],
            description: 'A sample repository for demonstration',
            stars: Math.floor(Math.random() * 10000),
            forks: Math.floor(Math.random() * 1000),
            languages: ['JavaScript', 'TypeScript', 'CSS'],
            createdAt: '2023-01-01',
            updatedAt: '2024-01-01'
          },
          scores: {
            overall: 78,
            codeQuality: 85,
            documentation: 72,
            testing: 65,
            ciCd: 45,
            maintainability: 82,
            collaboration: 91
          },
          badges: [
            { name: 'Code Quality Pro', level: 'Gold', category: 'quality', icon: '🏆', description: 'Exceptional code quality' },
            { name: 'Team Player', level: 'Silver', category: 'collaboration', icon: '👥', description: 'Strong collaboration' },
            { name: 'Documentation Expert', level: 'Bronze', category: 'docs', icon: '📚', description: 'Good documentation' }
          ],
          metrics: {
            totalFiles: 124,
            totalLines: 12456,
            averageComplexity: 2.4,
            codeSmells: 12,
            testCoverage: 65,
            documentationCoverage: 72,
            commitFrequency: 1.2,
            prMergeTime: 2.5,
            issueResponseTime: 1.8
          },
          aiAnalysis: {
            strengths: ['Clean code structure', 'Good commit messages', 'Active maintenance'],
            weaknesses: ['Low test coverage', 'Missing CI/CD pipeline', 'Sparse documentation'],
            recommendations: ['Add unit tests', 'Setup GitHub Actions', 'Improve README'],
            summary: 'This repository shows strong coding practices but needs improvement in testing and automation.',
            roadmap: [
              {
                week: 1,
                theme: 'Testing Foundation',
                tasks: [
                  { title: 'Add Jest setup', priority: 'High', estimatedTime: '2 hours', description: 'Setup testing framework' },
                  { title: 'Write basic tests', priority: 'High', estimatedTime: '4 hours', description: 'Add unit tests for core functions' }
                ]
              },
              {
                week: 2,
                theme: 'CI/CD Setup',
                tasks: [
                  { title: 'Create GitHub Actions', priority: 'Medium', estimatedTime: '3 hours', description: 'Setup automated testing pipeline' }
                ]
              }
            ]
          },
          visualizations: {
            languageDistribution: { JavaScript: 65, TypeScript: 25, CSS: 10 },
            healthMeter: { overall: 78 }
          }
        }
        
        setAnalysis(mockAnalysis)
        toast.success('Analysis completed successfully!')
        
        // Store in local storage for history
        const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]')
        history.unshift({
          id: mockAnalysis._id,
          url: url,
          score: mockAnalysis.scores.overall,
          date: new Date().toISOString()
        })
        localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 10)))
        
        setLoading(false)
      }, 3000)
    } catch (error) {
      clearInterval(progressInterval)
      toast.error('Analysis failed')
      setLoading(false)
    }
  }

  const exportPDF = async () => {
    if (!analysis) return
    
    try {
      toast.success('PDF export started!')
      // In real app: actual PDF generation
    } catch (error) {
      toast.error('Failed to export PDF')
    }
  }

  const shareAnalysis = () => {
    if (!analysis) return
    
    const shareUrl = `${window.location.origin}/report/${analysis._id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard!')
  }

  const renderScoreRing = (score, label, color) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={color}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{score}</div>
              <div className="text-sm text-gray-500">/100</div>
            </div>
          </div>
        </div>
        <div className="font-medium text-gray-700">{label}</div>
      </div>
    )
  }

  const renderMetricsChart = () => {
    if (!analysis?.scores) return null

    const data = [
      { name: 'Code Quality', value: analysis.scores.codeQuality },
      { name: 'Documentation', value: analysis.scores.documentation },
      { name: 'Testing', value: analysis.scores.testing },
      { name: 'CI/CD', value: analysis.scores.ciCd },
      { name: 'Maintainability', value: analysis.scores.maintainability },
      { name: 'Collaboration', value: analysis.scores.collaboration }
    ]

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderBadges = () => {
    if (!analysis?.badges) return null

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {analysis.badges.map((badge, index) => (
          <div key={index} className="card text-center">
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className={`badge badge-${badge.level.toLowerCase()} mb-2`}>
              {badge.level}
            </div>
            <h4 className="font-semibold mb-1">{badge.name}</h4>
            <p className="text-sm text-gray-600">{badge.description}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderRoadmap = () => {
    if (!analysis?.aiAnalysis?.roadmap) return null

    return (
      <div className="space-y-6">
        {analysis.aiAnalysis.roadmap.map((week, weekIndex) => (
          <div key={weekIndex} className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                {week.week}
              </div>
              <div>
                <h4 className="font-bold text-lg">{week.theme}</h4>
                <p className="text-gray-600">Week {week.week} of improvement plan</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {week.tasks?.map((task, taskIndex) => (
                <div key={taskIndex} className="border-l-4 border-primary-200 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-semibold">{task.title}</h5>
                    <span className={`badge ${
                      task.priority === 'High' ? 'badge-danger' :
                      task.priority === 'Medium' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{task.estimatedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="spinner w-16 h-16"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{progress}%</div>
              <div className="text-gray-600">Analyzing repository...</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">Fetching repository data...</p>
          <p className="text-gray-600">Analyzing code quality...</p>
          <p className="text-gray-600">Generating AI insights...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Analyze Repository</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="input-primary"
            />
            <button
              onClick={() => handleAnalyze(repoUrl)}
              className="btn-primary w-full"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{analysis.repositoryData.name}</h1>
            <p className="text-gray-600">
              by {analysis.repositoryData.owner} • 
              Updated {new Date(analysis.repositoryData.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportPDF}
              className="flex items-center space-x-2 btn-secondary"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={shareAnalysis}
              className="flex items-center space-x-2 btn-secondary"
            >
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => handleAnalyze(analysis.repositoryUrl)}
              className="flex items-center space-x-2 btn-primary"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Re-analyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-6">Overall Score</h2>
        <div className="flex justify-center">
          {renderScoreRing(analysis.scores.overall, 'Overall Score', 'text-primary-500')}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          {renderScoreRing(analysis.scores.codeQuality, 'Code Quality', 'text-blue-500')}
          {renderScoreRing(analysis.scores.documentation, 'Documentation', 'text-green-500')}
          {renderScoreRing(analysis.scores.testing, 'Testing', 'text-yellow-500')}
          {renderScoreRing(analysis.scores.ciCd, 'CI/CD', 'text-purple-500')}
          {renderScoreRing(analysis.scores.maintainability, 'Maintainability', 'text-orange-500')}
          {renderScoreRing(analysis.scores.collaboration, 'Collaboration', 'text-pink-500')}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {['overview', 'metrics', 'badges', 'roadmap', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Repository Info */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Repository Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Description</span>
                  <span className="font-medium">{analysis.repositoryData.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stars</span>
                  <span className="font-medium">{analysis.repositoryData.stars}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Forks</span>
                  <span className="font-medium">{analysis.repositoryData.forks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium">{analysis.repositoryData.languages?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(analysis.repositoryData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">AI Insights</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-gray-700">{analysis.aiAnalysis?.summary}</p>
                </div>
                
                {analysis.aiAnalysis?.strengths?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                    <ul className="space-y-1">
                      {analysis.aiAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.aiAnalysis?.weaknesses?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {analysis.aiAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2"></div>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Detailed Metrics</h3>
            {renderMetricsChart()}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {analysis.metrics && Object.entries(analysis.metrics).map(([key, value]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="font-medium text-gray-700 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Earned Badges</h3>
            {renderBadges()}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Improvement Roadmap</h3>
            {renderRoadmap()}
          </div>
        )}

        {activeTab === 'insights' && analysis.aiAnalysis && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Detailed Recommendations</h3>
              <div className="space-y-4">
                {analysis.aiAnalysis.recommendations?.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {analysis.visualizations && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Visual Analytics</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Interactive charts and graphs would appear here</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis