import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import RepoInput from '../components/RepoInput'
import {
  ChartBarIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Home = () => {
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = async (repoUrl) => {
    setAnalyzing(true)
    try {
      // In a real app, this would be an API call
      toast.success('Analysis started! Redirecting...')
      // Simulate API call
      setTimeout(() => {
        window.location.href = `/analyze?repo=${encodeURIComponent(repoUrl)}`
      }, 1500)
    } catch (error) {
      toast.error('Failed to start analysis')
    } finally {
      setAnalyzing(false)
    }
  }

  const features = [
    {
      icon: ChartBarIcon,
      title: 'Comprehensive Analytics',
      description: 'Get detailed insights across 15+ metrics including code quality, testing, and collaboration.'
    },
    {
      icon: CodeBracketIcon,
      title: 'AI-Powered Code Review',
      description: 'Receive intelligent suggestions for code improvements using advanced AI.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Professional Reports',
      description: 'Generate PDF reports ready for your portfolio or technical interviews.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Personalized Roadmap',
      description: 'Get a customized improvement plan based on your repository analysis.'
    },
    {
      icon: UserGroupIcon,
      title: 'Skill Badges',
      description: 'Earn verified badges to showcase your expertise on your developer profile.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Security Analysis',
      description: 'Identify potential security vulnerabilities and best practice violations.'
    }
  ]

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Senior Developer @ TechCorp',
      content: 'RepoInsight helped me identify critical areas for improvement in our codebase. The AI suggestions were spot-on!',
      avatar: 'AJ'
    },
    {
      name: 'Maria Chen',
      role: 'Engineering Manager',
      content: 'The detailed reports are perfect for onboarding new team members and maintaining code quality standards.',
      avatar: 'MC'
    },
    {
      name: 'David Park',
      role: 'Open Source Maintainer',
      content: 'The comparison feature helped me benchmark our repository against industry standards. Incredibly valuable!',
      avatar: 'DP'
    }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your <span className="gradient-text">GitHub Repository</span> into Career Intelligence
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Get instant, AI-powered insights on your code quality, project structure, and career readiness. 
            Turn your repository into a hiring magnet.
          </p>
          
          <RepoInput onAnalyze={handleAnalyze} loading={analyzing} />
          
          <div className="mt-16">
            <p className="text-gray-500 mb-4">Trusted by developers at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <span className="text-xl font-semibold">Vercel</span>
              <span className="text-xl font-semibold">Stripe</span>
              <span className="text-xl font-semibold">Linear</span>
              <span className="text-xl font-semibold">GitHub</span>
              <span className="text-xl font-semibold">VSCode</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="gradient-text">Level Up</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive analysis tools powered by cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:border-primary-300 transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How <span className="gradient-text">RepoInsight</span> Works
          </h2>
          <p className="text-gray-600 text-lg">Three simple steps to repository excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center relative">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-xl mb-3">Enter Repository URL</h3>
            <p className="text-gray-600">Paste your GitHub repository link</p>
            <div className="absolute top-8 right-0 h-0.5 w-full md:w-1/2 bg-gradient-to-r from-primary-500 to-transparent hidden md:block"></div>
          </div>

          <div className="text-center relative">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-xl mb-3">AI Analysis</h3>
            <p className="text-gray-600">Our AI analyzes 15+ metrics in seconds</p>
            <div className="absolute top-8 right-0 h-0.5 w-full md:w-1/2 bg-gradient-to-r from-primary-500 to-transparent hidden md:block"></div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-xl mb-3">Get Insights</h3>
            <p className="text-gray-600">Receive detailed report and improvement roadmap</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Developers <span className="gradient-text">Say</span>
          </h2>
          <p className="text-gray-600 text-lg">Join thousands of developers improving their craft</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <SparklesIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <SparklesIcon className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your GitHub Profile?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who are leveling up their skills with AI-powered insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analyze"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 inline-flex items-center justify-center"
            >
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              Analyze Repository
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              Get Started Free
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-75">
            No credit card required • Instant analysis • Privacy focused
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home