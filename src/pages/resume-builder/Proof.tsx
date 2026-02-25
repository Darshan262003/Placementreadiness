import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { 
  getProofSubmission, 
  saveProofSubmission,
  getCompletedStepsCount,
  type ResumeBuilderState,
  type ProofSubmission 
} from '../../types/resumeBuilder'
import { CheckCircle2, Circle, Copy, Github, Globe, Sparkles, CheckCircle } from 'lucide-react'

function Proof() {
  const { state } = useOutletContext<{ state: ResumeBuilderState }>()
  const [submission, setSubmission] = useState<ProofSubmission>({
    lovableLink: '',
    githubLink: '',
    deployLink: ''
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = getProofSubmission()
    if (saved) {
      setSubmission(saved)
    }
  }, [])

  const handleInputChange = (field: keyof ProofSubmission, value: string) => {
    const updated = { ...submission, [field]: value }
    setSubmission(updated)
    saveProofSubmission(updated)
  }

  const completedCount = getCompletedStepsCount(state)
  const allStepsComplete = completedCount === 8

  const generateSubmissionText = () => {
    return `AI Resume Builder — Project 3 Submission

Step Completion: ${completedCount}/8

Links:
- Lovable Project: ${submission.lovableLink || 'Not provided'}
- GitHub Repository: ${submission.githubLink || 'Not provided'}
- Deployed App: ${submission.deployLink || 'Not provided'}

Submitted: ${new Date().toLocaleString()}
`
  }

  const handleCopySubmission = () => {
    navigator.clipboard.writeText(generateSubmissionText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Proof of Completion</h1>
        <p className="text-gray-600">Project 3: AI Resume Builder — Build Track</p>
      </div>

      {/* Step Status */}
      <Card>
        <CardHeader>
          <CardTitle>Build Progress</CardTitle>
          <CardDescription>Status of all 8 build steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state?.steps.map((step) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  step.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    Step {step.number}: {step.title}
                  </p>
                </div>
                {step.artifact && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    {step.artifact.status === 'success' ? 'Built' : 'Error'}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall Progress</span>
              <span className={`font-bold ${allStepsComplete ? 'text-green-600' : 'text-gray-900'}`}>
                {completedCount}/8
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  allStepsComplete ? 'bg-green-500' : 'bg-primary'
                }`}
                style={{ width: `${(completedCount / 8) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Links */}
      <Card>
        <CardHeader>
          <CardTitle>Project Links</CardTitle>
          <CardDescription>Add your project links for final submission</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Lovable Project Link
              </span>
            </label>
            <input
              type="url"
              value={submission.lovableLink}
              onChange={(e) => handleInputChange('lovableLink', e.target.value)}
              placeholder="https://lovable.dev/projects/..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Repository Link
              </span>
            </label>
            <input
              type="url"
              value={submission.githubLink}
              onChange={(e) => handleInputChange('githubLink', e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                Deployed App Link
              </span>
            </label>
            <input
              type="url"
              value={submission.deployLink}
              onChange={(e) => handleInputChange('deployLink', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Final Submission */}
      <Card className={allStepsComplete ? 'border-green-400' : ''}>
        <CardHeader>
          <CardTitle>Final Submission</CardTitle>
          <CardDescription>
            {allStepsComplete 
              ? 'All steps complete! Copy your submission.' 
              : 'Complete all steps to unlock submission.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-600 mb-4 whitespace-pre-wrap">
            {generateSubmissionText()}
          </div>

          <button
            onClick={handleCopySubmission}
            disabled={!allStepsComplete}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              allStepsComplete
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Final Submission
              </>
            )}
          </button>

          {!allStepsComplete && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Complete all 8 steps to enable submission
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Open Lovable
        </a>
        <a
          href="https://github.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <Github className="w-4 h-4" />
          New Repository
        </a>
        <a
          href="https://vercel.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <Globe className="w-4 h-4" />
          Deploy
        </a>
      </div>
    </div>
  )
}

export default Proof
