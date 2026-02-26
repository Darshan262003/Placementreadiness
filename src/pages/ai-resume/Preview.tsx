import { useState } from 'react'
import { Printer, FileText, AlertTriangle, CheckCircle, Download, Palette, Target } from 'lucide-react'
import { useResume } from '../../components/AIResumeLayout'
import ResumePreview from './ResumePreview'
import { type ResumeTemplate, type ResumeColor, getSavedTemplate, saveTemplate, getSavedColor, saveColor, COLOR_THEMES } from '../../types/aiResume'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { generatePlainTextResume, checkResumeCompleteness } from '../../utils/textExport'
import { TemplateThumbnails } from '../../components/TemplateThumbnails'
import { ColorPicker } from '../../components/ColorPicker'
import { ATSScoreCircle, ATSScoreDetails } from '../../components/ATSScoreCircle'

function Preview() {
  const { resume } = useResume()
  const [template, setTemplate] = useState<ResumeTemplate>(getSavedTemplate())
  const [color, setColor] = useState<ResumeColor>(getSavedColor())
  const [copied, setCopied] = useState(false)
  const [showPdfToast, setShowPdfToast] = useState(false)

  const handleTemplateChange = (newTemplate: ResumeTemplate) => {
    setTemplate(newTemplate)
    saveTemplate(newTemplate)
  }

  const handleColorChange = (newColor: ResumeColor) => {
    setColor(newColor)
    saveColor(newColor)
  }

  const handlePrint = () => {
    window.print()
  }

  const handlePdfDownload = () => {
    setShowPdfToast(true)
    setTimeout(() => setShowPdfToast(false), 3000)
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
  const accentColor = COLOR_THEMES[color]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 print:px-0 print:py-0">
      {/* Header - Hidden in print */}
      <div className="text-center mb-8 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Preview</h1>
        <p className="text-gray-600">Choose your template and customize colors</p>
      </div>

      {/* ATS Score Card - Hidden in print */}
      <Card className="mb-6 print:hidden">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            ATS Resume Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 items-start">
            <ATSScoreCircle resume={resume} />
            <div className="flex-1">
              <ATSScoreDetails resume={resume} />
            </div>
          </div>
        </CardContent>
      </Card>

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
          <CardTitle className="text-base">Choose Template</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateThumbnails
            activeTemplate={template}
            onSelect={handleTemplateChange}
            accentColor={accentColor}
          />
        </CardContent>
      </Card>

      {/* Color Theme Picker - Hidden in print */}
      <Card className="mb-6 print:hidden">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ColorPicker
            activeColor={color}
            onSelect={handleColorChange}
          />
        </CardContent>
      </Card>

      {/* Export Buttons - Hidden in print */}
      <div className="flex gap-3 mb-6 print:hidden">
        <button
          onClick={handlePdfDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
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

      {/* PDF Toast Notification */}
      {showPdfToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="font-medium text-sm">PDF export ready!</p>
              <p className="text-xs text-gray-400">Check your downloads.</p>
            </div>
          </div>
        </div>
      )}

      {/* Resume Display */}
      <div className="bg-white shadow-lg border border-gray-200 print:shadow-none print:border-none">
        {/* Page indicator - Hidden in print */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between print:hidden">
          <span className="text-sm text-gray-500">Page 1 of 1</span>
          <span className="text-xs text-gray-400">{template} • {color}</span>
        </div>

        {/* Resume Content */}
        <div className="p-12 print:p-0">
          <div className="max-w-3xl mx-auto">
            <ResumePreview resume={resume} template={template} color={color} />
          </div>
        </div>
      </div>

      {/* Info - Hidden in print */}
      <div className="mt-8 text-center print:hidden">
        <p className="text-sm text-gray-500">
          This is how your resume will look when exported.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Colors and layouts are optimized for both screen viewing and printing.
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
