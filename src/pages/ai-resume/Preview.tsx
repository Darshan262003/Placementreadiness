import { useState } from 'react'
import { Layout } from 'lucide-react'
import { useResume } from '../../components/AIResumeLayout'
import ResumePreview from './ResumePreview'
import { type ResumeTemplate, getSavedTemplate, saveTemplate } from '../../types/aiResume'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' }
]

function Preview() {
  const { resume } = useResume()
  const [template, setTemplate] = useState<ResumeTemplate>(getSavedTemplate())

  const handleTemplateChange = (newTemplate: ResumeTemplate) => {
    setTemplate(newTemplate)
    saveTemplate(newTemplate)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Preview</h1>
        <p className="text-gray-600">Clean, minimal design optimized for readability</p>
      </div>

      {/* Template Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Choose Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateChange(t.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  template === t.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resume Display */}
      <div className="bg-white shadow-lg border border-gray-200">
        {/* Page indicator */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">Page 1 of 1</span>
          <span className="text-xs text-gray-400">A4 Format • {template}</span>
        </div>

        {/* Resume Content */}
        <div className="p-12">
          <div className="max-w-2xl mx-auto">
            <ResumePreview resume={resume} template={template} />
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
