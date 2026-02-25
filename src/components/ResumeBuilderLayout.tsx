import React, { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom'
import { 
  getResumeBuilderState, 
  saveResumeBuilderState,
  completeStep,
  canAccessStep,
  getCompletedStepsCount,
  type ResumeBuilderState,
  type StepArtifact
} from '../types/resumeBuilder'
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

function ResumeBuilderLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [state, setState] = useState<ResumeBuilderState | null>(null)
  const [copied, setCopied] = useState(false)
  const [buildStatus, setBuildStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [notes, setNotes] = useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    setState(getResumeBuilderState())
  }, [location.pathname])

  const currentPathStep = useCallback(() => {
    const match = location.pathname.match(/\/rb\/(\d+)-/)
    if (match) return parseInt(match[1])
    if (location.pathname === '/rb/proof') return 9
    return 1
  }, [location.pathname])

  const currentStepNumber = currentPathStep()
  const currentStepData = state?.steps.find(s => s.number === currentStepNumber)
  const isProofPage = location.pathname === '/rb/proof'

  useEffect(() => {
    if (state && !isProofPage) {
      const stepNum = currentPathStep()
      if (!canAccessStep(state, stepNum)) {
        const accessibleStep = state.steps.find(s => canAccessStep(state, s.number))
        if (accessibleStep) {
          navigate(accessibleStep.route)
        }
      }
    }
  }, [state, location.pathname, navigate, isProofPage, currentPathStep])

  const handleCopyPrompt = () => {
    if (currentStepData?.lovablePrompt) {
      navigator.clipboard.writeText(currentStepData.lovablePrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !state) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      const artifact: StepArtifact = {
        imageData,
        uploadedAt: new Date().toISOString(),
        status: buildStatus === 'error' ? 'error' : 'success',
        notes: notes || undefined
      }

      const newState = completeStep(state, currentStepNumber, artifact)
      setState(newState)
      saveResumeBuilderState(newState)
      setBuildStatus('idle')
      setNotes('')
    }
    reader.readAsDataURL(file)
  }

  const handleStepClick = (stepNumber: number) => {
    if (!state) return
    const step = state.steps.find(s => s.number === stepNumber)
    if (step && canAccessStep(state, stepNumber)) {
      navigate(step.route)
    }
  }

  const handleNext = () => {
    if (!state || !currentStepData) return
    
    if (!currentStepData.artifact) {
      alert('Please upload a screenshot before proceeding')
      return
    }

    const nextStep = state.steps.find(s => s.number === currentStepNumber + 1)
    if (nextStep) {
      navigate(nextStep.route)
    } else {
      navigate('/rb/proof')
    }
  }

  const handlePrev = () => {
    if (currentStepNumber > 1) {
      const prevStep = state?.steps.find(s => s.number === currentStepNumber - 1)
      if (prevStep) navigate(prevStep.route)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem('resume_builder_state')
      localStorage.removeItem('resume_builder_proof')
      setState(getResumeBuilderState())
      navigate('/rb/01-problem')
    }
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const completedCount = getCompletedStepsCount(state)

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RB</span>
            </div>
            <span className="font-semibold text-gray-900">AI Resume Builder</span>
          </div>

          {!isProofPage ? (
            <div className="text-sm text-gray-600">
              Project 3 — Step {currentStepNumber} of 8
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Project 3 — Proof of Completion
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isProofPage && currentStepData && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentStepData.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : currentStepData.status === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {currentStepData.status === 'completed' ? 'Completed' : 
                 currentStepData.status === 'active' ? 'In Progress' : 'Locked'}
              </span>
            )}
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600"
              title="Reset Progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Context Header */}
      {!isProofPage && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentStepData?.title}
              </h1>
              
              <div className="flex items-center gap-2">
                {state.steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.number)}
                    disabled={!canAccessStep(state, step.number)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : step.status === 'active'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      step.number
                    )}
                  </button>
                ))}
                <NavLink
                  to="/rb/proof"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isProofPage 
                      ? 'bg-primary text-white' 
                      : completedCount === 8
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          <div className="flex-[0.7] overflow-auto">
            <Outlet context={{ state, setState }} />
          </div>

          {!isProofPage && (
            <div className="flex-[0.3] space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy This Into Lovable
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <textarea
                    readOnly
                    value={currentStepData?.lovablePrompt || ''}
                    className="w-full h-48 p-3 text-xs bg-gray-50 border border-gray-200 rounded-lg resize-none font-mono"
                  />
                  <button
                    onClick={handleCopyPrompt}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Prompt
                      </>
                    )}
                  </button>
                  <a
                    href="https://lovable.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Lovable
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Build Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBuildStatus('success')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        buildStatus === 'success'
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mx-auto mb-1" />
                      It Worked
                    </button>
                    <button
                      onClick={() => setBuildStatus('error')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        buildStatus === 'error'
                          ? 'bg-red-100 text-red-700 border-2 border-red-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4 mx-auto mb-1" />
                      Error
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={buildStatus === 'idle'}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Add Screenshot
                  </button>

                  {currentStepData?.artifact && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Screenshot uploaded
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {new Date(currentStepData.artifact.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentStepNumber === 1}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentStepData?.artifact}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proof Footer */}
      {!isProofPage && (
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Progress: {completedCount}/8 steps
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(completedCount / 8) * 100}%` }}
                  />
                </div>
              </div>
              <NavLink
                to="/rb/proof"
                className={`text-sm font-medium ${
                  completedCount === 8 
                    ? 'text-green-600 hover:text-green-700' 
                    : 'text-gray-400'
                }`}
              >
                {completedCount === 8 ? 'View Proof →' : 'Complete all steps to view proof'}
              </NavLink>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default ResumeBuilderLayout
