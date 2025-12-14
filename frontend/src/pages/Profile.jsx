import React, { useState } from 'react'
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  TrophyIcon,
  StarIcon,
  FireIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const [user, setUser] = useState({
    username: 'developer123',
    email: 'dev@example.com',
    name: 'John Developer',
    bio: 'Passionate full-stack developer specializing in React & Node.js',
    location: 'San Francisco, CA',
    website: 'https://github.com/dev123',
    joinedDate: '2023-01-15'
  })

  const [stats, setStats] = useState({
    totalAnalyses: 24,
    averageScore: 82,
    currentStreak: 14,
    badgesEarned: 12,
    topLanguages: ['JavaScript', 'Python', 'TypeScript'],
    topRepositories: [
      { name: 'portfolio', score: 92 },
      { name: 'ecommerce-api', score: 87 },
      { name: 'task-manager', score: 79 }
    ]
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-16 w-16 text-white" />
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              <button className="btn-secondary mt-4 md:mt-0">
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            </div>
            
            <p className="mt-4 text-gray-700">{user.bio}</p>
            
            <div className="flex flex-wrap gap-4 mt-4 text-gray-600">
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </div>
              <div>{user.location}</div>
              <a href={user.website} className="text-primary-600 hover:underline">
                {user.website}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.totalAnalyses}</div>
          <div className="text-gray-600">Total Analyses</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <StarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.averageScore}</div>
          <div className="text-gray-600">Average Score</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FireIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.currentStreak}</div>
          <div className="text-gray-600">Day Streak</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrophyIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.badgesEarned}</div>
          <div className="text-gray-600">Badges Earned</div>
        </div>
      </div>

      {/* Top Languages & Repositories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Languages */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Top Languages</h2>
          <div className="space-y-4">
            {stats.topLanguages.map((language, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                  <span className="font-medium">{language}</span>
                </div>
                <div className="text-gray-600">
                  {Math.floor(Math.random() * 30) + 70}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Repositories */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Top Repositories</h2>
          <div className="space-y-4">
            {stats.topRepositories.map((repo, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    repo.score >= 90 ? 'bg-green-100 text-green-600' :
                    repo.score >= 80 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <StarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{repo.name}</h3>
                    <p className="text-sm text-gray-500">Repository</p>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  repo.score >= 90 ? 'text-green-600' :
                  repo.score >= 80 ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {repo.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Analyzed repository', repo: 'portfolio', score: 92, time: '2 hours ago' },
            { action: 'Earned badge', badge: 'Code Quality Pro', time: 'Yesterday' },
            { action: 'Compared repositories', repos: 'react vs vue', time: '2 days ago' },
            { action: 'Exported report', repo: 'ecommerce-api', time: '3 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold">{activity.action}</h3>
                  <p className="text-sm text-gray-500">
                    {activity.repo || activity.badge || activity.repos} • {activity.time}
                  </p>
                </div>
              </div>
              {activity.score && (
                <div className="text-2xl font-bold text-green-600">{activity.score}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile