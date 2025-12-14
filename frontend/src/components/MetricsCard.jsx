import React from 'react'

const MetricsCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600'
  }

  const changeColor = change.startsWith('+') ? 'text-green-600' : 'text-red-600'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`text-sm font-semibold ${changeColor}`}>
          {change}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="text-sm text-gray-500">
          Compared to last month
        </div>
      </div>
    </div>
  )
}

export default MetricsCard