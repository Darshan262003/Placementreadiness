import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { analyzeJD } from '../utils/skillExtractor'
import { saveAnalysis } from '../utils/storage'
import { Briefcase, Building2, FileText, Sparkles } from 'lucide-react'

function Analyzer() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    if (!jdText.trim()) return

    setIsAnalyzing(true)
    
    // Simulate brief delay for UX
    setTimeout(() => {
      const result = analyzeJD(company, role, jdText)
      saveAnalysis(result)
      navigate('/results', { state: { result } })
    }, 500)
  }

  const isValid = jdText.trim().length > 50

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">JD Analyzer</h2>
        <p className="text-gray-600">Paste a job description to get personalized preparation insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Analyze Job Description
          </CardTitle>
          <CardDescription>
            Enter the job details and paste the JD text to extract skills and generate a preparation plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4" />
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Microsoft"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4" />
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* JD Text */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Job Description
            </label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here... Include requirements, skills needed, and responsibilities for better analysis."
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
            />
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${jdText.length > 800 ? 'text-green-600' : 'text-gray-400'}`}>
                {jdText.length} characters {jdText.length > 800 && '✓ Detailed JD'}
              </span>
              <span className="text-xs text-gray-400">
                Minimum 50 characters
              </span>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!isValid || isAnalyzing}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isValid && !isAnalyzing
                ? 'bg-primary hover:bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze JD
              </>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-1">Better Results</h4>
          <p className="text-sm text-blue-700">Include skills, requirements, and responsibilities for accurate extraction</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-1">Score Boost</h4>
          <p className="text-sm text-green-700">JD over 800 characters gives +10 readiness points</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-1">Auto-Save</h4>
          <p className="text-sm text-purple-700">All analyses are saved to your history automatically</p>
        </div>
      </div>
    </div>
  )
}

export default Analyzer
