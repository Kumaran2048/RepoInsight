import React from 'react'
import { Link } from 'react-router-dom'
import { SparklesIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">RepoInsight</span>
            </div>
            <p className="text-gray-600 text-sm">
              AI-powered GitHub repository analyzer for developers
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/analyze" className="text-gray-600 hover:text-primary-600">Analyze</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link></li>
              <li><Link to="/compare" className="text-gray-600 hover:text-primary-600">Compare</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-primary-600">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-gray-600 hover:text-primary-600">Documentation</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary-600">Blog</Link></li>
              <li><Link to="/api" className="text-gray-600 hover:text-primary-600">API</Link></li>
              <li><Link to="/status" className="text-gray-600 hover:text-primary-600">Status</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary-600">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary-600">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary-600">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary-600">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} RepoInsight AI. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="https://twitter.com" className="text-gray-400 hover:text-primary-600">
              Twitter
            </a>
            <a href="https://github.com" className="text-gray-400 hover:text-primary-600">
              GitHub
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-primary-600">
              LinkedIn
            </a>
            <a href="https://discord.com" className="text-gray-400 hover:text-primary-600">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer