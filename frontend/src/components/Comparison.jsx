import React, { useState } from 'react'
import {
  ArrowPathIcon,
  ChartBarIcon,
  TrophyIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

const Comparison = () => {
  const [repo1, setRepo1] = useState('')
  const [repo2, setRepo2] = useState('')
  const [loading, setLoading] = useState(false)
  const [comparisonData, setComparisonData] = useState(null)

  // Mock comparison data
  const mockComparison = {
    repo1: {
      name: 'react',
      owner: 'facebook',
      score: 92,
      badges: ['Gold', 'Silver', 'Bronze'],
      metrics: {
        codeQuality: 95,
        documentation: 88,
        testing: 90,
        ciCd: 85,
        maintainability: 96,
        collaboration: 94
      }
    },
    repo2: {
      name: 'vue',
      owner: 'vuejs',
      score: 87,
      badges: ['Gold', 'Silver'],
      metrics: {
        codeQuality: 89,
        documentation: 85,
        testing: 82,
        ciCd: 90,
        maintainability: 88,
        collaboration: 86
      }
    },
    winner: 'repo1',
    differences: [
      { metric: 'Code Quality', diff: 6, better: 'repo1' },
      { metric: 'Testing', diff: 8, better: 'repo1' },
      { metric: 'CI/CD', diff: -5, better: 'repo2' },
      { metric: 'Maintainability', diff: 8, better: 'repo1' }
    ]
  }

  const handleCompare = () => {
    if (!repo1 || !repo2) return
    
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setComparisonData(mockComparison)
      setLoading(false)
    }, 2000)
  }

  const MetricBar = ({ value, label, isBetter }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className={isBetter ? 'text-green-600 font-semibold' : 'text-gray-600'}>
          {value}/100
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${isBetter ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Comparison Input */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Compare Repositories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repository 1
            </label>
            <input
              type="text"
              value={repo1}
              onChange={(e) => setRepo1(e.target.value)}
              placeholder="https://github.com/username/repo1"
              className="input-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repository 2
            </label>
            <input
              type="text"
              value={repo2}
              onChange={(e) => setRepo2(e.target.value)}
              placeholder="https://github.com/username/repo2"
              className="input-primary"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleCompare}
            disabled={loading || !repo1 || !repo2}
            className="btn-primary w-full md:w-auto"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                Comparing...
              </span>
            ) : (
              'Compare Repositories'
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="space-y-8">
          {/* Overall Comparison */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Overall Comparison</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Repository 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {comparisonData.repo1.score}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-2">{comparisonData.repo1.name}</h4>
                <p className="text-gray-600">by {comparisonData.repo1.owner}</p>
              </div>
              
              {/* VS Badge */}
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold py-2 px-6 rounded-full">
                  VS
                </div>
              </div>
              
              {/* Repository 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {comparisonData.repo2.score}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-2">{comparisonData.repo2.name}</h4>
                <p className="text-gray-600">by {comparisonData.repo2.owner}</p>
              </div>
            </div>
            
            {/* Winner */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-full px-6 py-3">
                <TrophyIcon className="h-6 w-6 text-yellow-600 mr-2" />
                <span className="font-bold">
                  {comparisonData.winner === 'repo1' ? comparisonData.repo1.name : comparisonData.repo2.name}
                </span>
                <span className="ml-2">wins by {Math.abs(comparisonData.repo1.score - comparisonData.repo2.score)} points!</span>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Repository 1 Metrics */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-blue-500" />
                {comparisonData.repo1.name} Metrics
              </h3>
              
              {Object.entries(comparisonData.repo1.metrics).map(([key, value]) => (
                <MetricBar
                  key={key}
                  value={value}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  isBetter={comparisonData.winner === 'repo1'}
                />
              ))}
            </div>

            {/* Repository 2 Metrics */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-purple-500" />
                {comparisonData.repo2.name} Metrics
              </h3>
              
              {Object.entries(comparisonData.repo2.metrics).map(([key, value]) => (
                <MetricBar
                  key={key}
                  value={value}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  isBetter={comparisonData.winner === 'repo2'}
                />
              ))}
            </div>
          </div>

          {/* Key Differences */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Key Differences</h3>
            
            <div className="space-y-4">
              {comparisonData.differences.map((diff, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    {diff.better === 'repo1' ? (
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <div>
                      <span className="font-medium">{diff.metric}</span>
                      <div className="text-sm text-gray-500">
                        {diff.better === 'repo1' ? comparisonData.repo1.name : comparisonData.repo2.name} is better by {Math.abs(diff.diff)} points
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-lg font-bold ${
                    diff.better === 'repo1' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {diff.diff > 0 ? `+${diff.diff}` : diff.diff}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Comparison