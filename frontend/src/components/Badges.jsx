import React from 'react'
import {
  TrophyIcon,
  StarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  BeakerIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const Badges = () => {
  const badges = [
    { id: 1, name: 'Code Quality Pro', level: 'Gold', icon: CodeBracketIcon, earned: true },
    { id: 2, name: 'Testing Champion', level: 'Silver', icon: BeakerIcon, earned: true },
    { id: 3, name: 'Documentation Master', level: 'Gold', icon: DocumentTextIcon, earned: true },
    { id: 4, name: 'Team Player', level: 'Silver', icon: UserGroupIcon, earned: true },
    { id: 5, name: 'Security Expert', level: 'Bronze', icon: ShieldCheckIcon, earned: false },
    { id: 6, name: 'CI/CD Pioneer', level: 'Silver', icon: RocketLaunchIcon, earned: false },
    { id: 7, name: 'Elite Developer', level: 'Gold', icon: TrophyIcon, earned: true },
    { id: 8, name: 'Repository Star', level: 'Basic', icon: StarIcon, earned: true }
  ]

  const getLevelColor = (level) => {
    switch(level) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800'
      case 'Silver': return 'bg-gray-100 text-gray-800'
      case 'Bronze': return 'bg-orange-100 text-orange-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
            badge.earned 
              ? 'border-primary-200 bg-white' 
              : 'border-gray-200 bg-gray-50 opacity-50'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
            badge.earned ? 'bg-primary-100' : 'bg-gray-200'
          }`}>
            <badge.icon className={`h-6 w-6 ${
              badge.earned ? 'text-primary-600' : 'text-gray-400'
            }`} />
          </div>
          
          <span className={`badge ${getLevelColor(badge.level)} mb-2`}>
            {badge.level}
          </span>
          
          <h3 className="text-sm font-medium text-center mb-1">{badge.name}</h3>
          
          <div className={`text-xs ${
            badge.earned ? 'text-green-600' : 'text-gray-500'
          }`}>
            {badge.earned ? '✓ Earned' : 'Locked'}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Badges