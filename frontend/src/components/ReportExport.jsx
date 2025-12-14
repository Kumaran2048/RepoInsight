import React from 'react'
import {
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  EnvelopeIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline'

const ReportExport = ({ analysisId, reportData }) => {
  const exportOptions = [
    {
      id: 1,
      name: 'PDF Report',
      description: 'Professional PDF with all analysis details',
      icon: DocumentArrowDownIcon,
      format: 'pdf',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 2,
      name: 'JSON Data',
      description: 'Raw JSON data for integration',
      icon: CloudArrowDownIcon,
      format: 'json',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      name: 'Print',
      description: 'Print-friendly version',
      icon: PrinterIcon,
      format: 'print',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 4,
      name: 'Share',
      description: 'Generate shareable link',
      icon: ShareIcon,
      format: 'share',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 5,
      name: 'Email',
      description: 'Send to email',
      icon: EnvelopeIcon,
      format: 'email',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ]

  const handleExport = (format) => {
    // Handle export based on format
    switch(format) {
      case 'pdf':
        console.log('Exporting PDF...')
        // Generate and download PDF
        break
      case 'json':
        console.log('Exporting JSON...')
        // Download JSON
        break
      case 'print':
        window.print()
        break
      case 'share':
        navigator.clipboard.writeText(`${window.location.origin}/report/${analysisId}`)
        alert('Share link copied to clipboard!')
        break
      case 'email':
        console.log('Sending email...')
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">Export Report</h2>
        <p className="text-gray-600">
          Export your repository analysis in various formats
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportOptions.map((option) => (
          <div
            key={option.id}
            className="card hover:border-primary-300 cursor-pointer transition-all duration-300"
            onClick={() => handleExport(option.format)}
          >
            <div className="flex items-start mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${option.color}`}>
                <option.icon className="h-6 w-6" />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg mb-2">{option.name}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button className="btn-secondary w-full">
                Export as {option.format.toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Section */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Report Preview</h3>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold">Repository Analysis Report</h4>
              <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-3xl font-bold text-primary-600">
              {reportData?.score || 85}/100
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-500">Code Quality</div>
              <div className="text-2xl font-bold">{reportData?.metrics?.codeQuality || 92}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-500">Documentation</div>
              <div className="text-2xl font-bold">{reportData?.metrics?.documentation || 88}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-500">Testing</div>
              <div className="text-2xl font-bold">{reportData?.metrics?.testing || 90}</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            This is a preview of the exported report. The full report includes detailed analysis,
            AI recommendations, improvement roadmap, and visual charts.
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Advanced Export Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Include AI Recommendations</h4>
              <p className="text-sm text-gray-600">Add detailed AI improvement suggestions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Include Visual Charts</h4>
              <p className="text-sm text-gray-600">Add graphs and visualizations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Include Raw Data</h4>
              <p className="text-sm text-gray-600">Add raw metrics and calculations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportExport