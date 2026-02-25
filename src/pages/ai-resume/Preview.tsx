import { useResume } from '../../components/AIResumeLayout'
import ResumePreview from './ResumePreview'

function Preview() {
  const { resume } = useResume()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Preview</h1>
        <p className="text-gray-600">Clean, minimal design optimized for readability</p>
      </div>

      {/* Resume Display */}
      <div className="bg-white shadow-lg border border-gray-200">
        {/* Page indicator */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">Page 1 of 1</span>
          <span className="text-xs text-gray-400">A4 Format</span>
        </div>

        {/* Resume Content */}
        <div className="p-12">
          <div className="max-w-2xl mx-auto">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          This is how your resume will look when exported.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Black and white design ensures maximum compatibility with ATS systems.
        </p>
      </div>
    </div>
  )
}

export default Preview
