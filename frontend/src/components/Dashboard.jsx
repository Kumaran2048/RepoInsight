import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  CalendarIcon,
  FireIcon,
  StarIcon,
  CodeBracketIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import MetricsCard from './MetricsCard'
import Badges from './Badges'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    badgesEarned: 0,
    currentStreak: 0,
    recentAnalyses: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setStats({
        totalAnalyses: 12,
        averageScore: 78,
        badgesEarned: 8,
        currentStreak: 7,
        recentAnalyses: [
          { id: 1, name: 'react', score: 85, date: '2024-01-15' },
          { id: 2, name: 'express-api', score: 72, date: '2024-01-14' },
          { id: 3, name: 'todo-app', score: 65, date: '2024-01-13' },
          { id: 4, name: 'portfolio', score: 91, date: '2024-01-12' },
          { id: 5, name: 'ecommerce', score: 58, date: '2024-01-11' }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Developer! 👋</h1>
            <p className="text-gray-600">Here's your repository analysis overview</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/analyze" className="btn-primary inline-flex items-center">
              <CodeBracketIcon className="h-5 w-5 mr-2" />
              Analyze New Repository
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Analyses"
          value={stats.totalAnalyses}
          change="+12%"
          icon={ChartBarIcon}
          color="blue"
        />
        <MetricsCard
          title="Average Score"
          value={`${stats.averageScore}/100`}
          change="+5 points"
          icon={ArrowTrendingUpIcon}
          color="green"
        />
        <MetricsCard
          title="Badges Earned"
          value={stats.badgesEarned}
          change="+3 new"
          icon={TrophyIcon}
          color="yellow"
        />
        <MetricsCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          change="Keep it up!"
          icon={FireIcon}
          color="red"
        />
      </div>

      {/* Recent Analyses & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Analyses */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              Recent Analyses
            </h2>
            <Link to="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {stats.recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    analysis.score >= 80 ? 'bg-green-100 text-green-600' :
                    analysis.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <StarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{analysis.name}</h3>
                    <p className="text-sm text-gray-500">
                      Analyzed on {new Date(analysis.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    analysis.score >= 80 ? 'text-green-600' :
                    analysis.score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analysis.score}
                  </div>
                  <div className="text-sm text-gray-500">/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2" />
              Your Badges
            </h2>
            <Link to="/badges" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <Badges />
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress to next level</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <DocumentTextIcon className="h-6 w-6 mr-2" />
          AI Improvement Suggestions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h3 className="font-semibold mb-2">Improve Documentation</h3>
            <p className="text-gray-600 text-sm">
              Add comprehensive README with usage examples
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="font-semibold mb-2">Add Tests</h3>
            <p className="text-gray-600 text-sm">
              Increase test coverage to 80%+
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-semibold mb-2">Setup CI/CD</h3>
            <p className="text-gray-600 text-sm">
              Implement GitHub Actions for automated testing
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard