import { useState } from 'react'
import { Layout, Printer, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import { useResume } from '../../components/AIResumeLayout'
import ResumePreview from './ResumePreview'
import { type ResumeTemplate, getSavedTemplate, saveTemplate } from '../../types/aiResume'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { generatePlainTextResume, checkResumeCompleteness } from '../../utils/textExport'

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' }
]

function Preview() {
  const { resume } = useResume()
  const [template, setTemplate] = useState<ResumeTemplate>(getSavedTemplate())
  const [copied, setCopied] = useState(false)

  const handleTemplateChange = (newTemplate: ResumeTemplate) => {
    setTemplate(newTemplate)
    saveTemplate(newTemplate)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = async () => {
    const text = generatePlainTextResume(resume)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const completeness = checkResumeCompleteness(resume)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 print:px-0 print:py-0">
      {/* Header - Hidden in print */}
      <div className="text-center mb-8 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Preview</h1>
        <p className="text-gray-600">Clean, minimal design optimized for readability</p>
      </div>

      {/* Validation Warning - Hidden in print */}
      {!completeness.isComplete && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg print:hidden">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Your resume may look incomplete
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Missing: {completeness.missing.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector - Hidden in print */}
      <Card className="mb-6 print:hidden">
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

      {/* Export Buttons - Hidden in print */}
      <div className="flex gap-3 mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
        <button
          onClick={handleCopyText}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Copy as Text
            </>
          )}
        </button>
      </div>

      {/* Resume Display */}
      <div className="bg-white shadow-lg border border-gray-200 print:shadow-none print:border-none">
        {/* Page indicator - Hidden in print */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between print:hidden">
          <span className="text-sm text-gray-500">Page 1 of 1</span>
          <span className="text-xs text-gray-400">A4 Format • {template}</span>
        </div>

        {/* Resume Content */}
        <div className="p-12 print:p-0">
          <div className="max-w-2xl mx-auto">
            <ResumePreview resume={resume} template={template} />
          </div>
        </div>
      </div>

      {/* Info - Hidden in print */}
      <div className="mt-8 text-center print:hidden">
        <p className="text-sm text-gray-500">
          This is how your resume will look when exported.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Black and white design ensures maximum compatibility with ATS systems.
        </p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 1.5cm;
            size: A4;
          }
          
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border-none {
            border: none !important;
          }
          
          /* Ensure sections don't break awkwardly */
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          
          /* Force background colors in print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Preview
