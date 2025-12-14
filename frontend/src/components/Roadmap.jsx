import React from 'react'
import { CheckCircleIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'

const Roadmap = () => {
  const roadmapSteps = [
    {
      week: 1,
      title: 'Code Quality Foundation',
      tasks: [
        { id: 1, name: 'Setup ESLint & Prettier', completed: true },
        { id: 2, name: 'Fix critical code smells', completed: true },
        { id: 3, name: 'Add code comments', completed: false }
      ],
      status: 'in-progress'
    },
    {
      week: 2,
      title: 'Testing & Documentation',
      tasks: [
        { id: 4, name: 'Add unit tests', completed: false },
        { id: 5, name: 'Setup test coverage', completed: false },
        { id: 6, name: 'Improve README', completed: false }
      ],
      status: 'pending'
    },
    {
      week: 3,
      title: 'CI/CD Implementation',
      tasks: [
        { id: 7, name: 'Setup GitHub Actions', completed: false },
        { id: 8, name: 'Add automated tests', completed: false },
        { id: 9, name: 'Configure deployment', completed: false }
      ],
      status: 'pending'
    },
    {
      week: 4,
      title: 'Advanced Practices',
      tasks: [
        { id: 10, name: 'Add performance tests', completed: false },
        { id: 11, name: 'Security audit', completed: false },
        { id: 12, name: 'Add contribution guidelines', completed: false }
      ],
      status: 'pending'
    }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Improvement Roadmap</h2>
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>4-week plan</span>
        </div>
      </div>

      <div className="space-y-6">
        {roadmapSteps.map((step) => (
          <div key={step.week} className="card">
            <div className="flex items-start mb-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                step.status === 'completed' ? 'bg-green-100' :
                step.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <span className={`text-xl font-bold ${
                  step.status === 'completed' ? 'text-green-600' :
                  step.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.week}
                </span>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <span className={`badge ${getStatusColor(step.status)}`}>
                    {step.status === 'completed' ? 'Completed' :
                     step.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                  </span>
                </div>
                
                <div className="space-y-3 mt-4">
                  {step.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {task.completed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                          {task.name}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {task.completed ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {step.status === 'in-progress' && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Week progress</span>
                  <span>2/3 tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to level up?</h3>
            <p className="text-gray-600">
              Complete your roadmap to unlock advanced developer badges and improve your repository score.
            </p>
          </div>
          <button className="btn-primary mt-4 md:mt-0">
            View Detailed Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default Roadmap