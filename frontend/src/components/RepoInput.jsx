import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const RepoInput = ({ onAnalyze, loading }) => {
  const [repoUrl, setRepoUrl] = useState('')
  const [isValid, setIsValid] = useState(true)
  const navigate = useNavigate()

  const validateGitHubUrl = (url) => {
    const githubRegex = /^https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+(?:\/)?$/
    return githubRegex.test(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateGitHubUrl(repoUrl)) {
      setIsValid(false)
      toast.error('Please enter a valid GitHub repository URL')
      return
    }

    setIsValid(true)
    
    if (onAnalyze) {
      onAnalyze(repoUrl)
    } else {
      // Navigate to analysis page with repo URL
      navigate('/analyze', { state: { repoUrl } })
    }
  }

  const handleExampleClick = () => {
    const examples = [
      'https://github.com/facebook/react',
      'https://github.com/tensorflow/tensorflow',
      'https://github.com/vercel/next.js',
      'https://github.com/nodejs/node'
    ]
    const randomExample = examples[Math.floor(Math.random() * examples.length)]
    setRepoUrl(randomExample)
    setIsValid(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Analyze Your <span className="gradient-text">GitHub Repository</span>
        </h2>
        <p className="text-gray-600 text-lg">
          Get instant AI-powered insights on code quality, best practices, and improvement opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="flex items-center">
            <div className="flex-grow">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value)
                  if (!isValid) setIsValid(true)
                }}
                placeholder="https://github.com/username/repository"
                className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none transition duration-300 ${
                  isValid
                    ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
                    : 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                }`}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="ml-4 btn-primary py-4 px-8 text-lg flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="spinner-small w-5 h-5"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
          
          {!isValid && (
            <p className="mt-2 text-sm text-red-600">
              Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
          <button
            type="button"
            onClick={handleExampleClick}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <SparklesIcon className="h-4 w-4" />
            <span>Try an example repository</span>
          </button>
          <span className="hidden sm:inline">•</span>
          <span>Supports all public GitHub repositories</span>
          <span className="hidden sm:inline">•</span>
          <span>Analysis takes 30-60 seconds</span>
        </div>
      </form>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">AI-Powered Analysis</h3>
          <p className="text-gray-600">
            Get detailed insights using advanced AI algorithms
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Actionable Insights</h3>
          <p className="text-gray-600">
            Receive specific recommendations for improvement
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
          <p className="text-gray-600">
            Your code is analyzed securely and never stored
          </p>
        </div>
      </div>
    </div>
  )
}

export default RepoInput