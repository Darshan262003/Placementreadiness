import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { getAnalysisById, updateAnalysis } from '../utils/storage'
import type { AnalysisResult, ExtractedSkills, SkillConfidence } from '../utils/skillExtractor'
import { 
  Target, 
  CheckCircle, 
  Calendar, 
  HelpCircle, 
  TrendingUp,
  ArrowLeft,
  Code,
  Database,
  Globe,
  Cloud,
  Bug,
  Cpu,
  Copy,
  Download,
  Check,
  AlertCircle,
  Play
} from 'lucide-react'

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [skillConfidence, setSkillConfidence] = useState<Record<string, SkillConfidence>>({})
  const [liveScore, setLiveScore] = useState<number>(0)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  // Initialize skill confidence from result or default to 'practice'
  useEffect(() => {
    if (result) {
      const initialConfidence: Record<string, SkillConfidence> = {}
      const allSkills = Object.values(result.extractedSkills).flat()
      
      // Use saved confidence map if available, otherwise default to 'practice'
      allSkills.forEach(skill => {
        initialConfidence[skill] = result.skillConfidenceMap?.[skill] || 'practice'
      })
      
      setSkillConfidence(initialConfidence)
      setLiveScore(result.readinessScore)
    }
  }, [result])

  // Calculate live score based on skill confidence
  useEffect(() => {
    if (result) {
      let adjustedScore = result.readinessScore
      Object.values(skillConfidence).forEach((confidence) => {
        if (confidence === 'know') {
          adjustedScore += 2
        } else {
          adjustedScore -= 2
        }
      })
      setLiveScore(Math.max(0, Math.min(100, adjustedScore)))
    }
  }, [skillConfidence, result])

  // Save changes to localStorage
  const saveChanges = useCallback(() => {
    if (result) {
      const updatedResult = {
        ...result,
        skillConfidenceMap: skillConfidence
      }
      updateAnalysis(updatedResult)
    }
  }, [result, skillConfidence])

  // Auto-save when confidence changes
  useEffect(() => {
    if (result && Object.keys(skillConfidence).length > 0) {
      saveChanges()
    }
  }, [skillConfidence, saveChanges])

  useEffect(() => {
    // First check location state (from Analyzer)
    const stateResult = location.state?.result as AnalysisResult
    if (stateResult) {
      setResult(stateResult)
      return
    }

    // Then check query param (from History)
    const id = searchParams.get('id')
    if (id) {
      const savedResult = getAnalysisById(id)
      if (savedResult) {
        setResult(savedResult)
      }
    }
  }, [location.state, searchParams])

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Found</h2>
        <p className="text-gray-600 mb-6">Analyze a job description to see results here</p>
        <button
          onClick={() => navigate('/analyzer')}
          className="bg-primary hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Go to Analyzer
        </button>
      </div>
    )
  }

  const { company, role, extractedSkills, readinessScore, checklist, plan, questions, createdAt } = result

  const categoryIcons: Record<keyof ExtractedSkills, React.ReactNode> = {
    'Core CS': <Cpu className="w-4 h-4" />,
    'Languages': <Code className="w-4 h-4" />,
    'Web': <Globe className="w-4 h-4" />,
    'Data': <Database className="w-4 h-4" />,
    'Cloud/DevOps': <Cloud className="w-4 h-4" />,
    'Testing': <Bug className="w-4 h-4" />
  }

  const categoryColors: Record<keyof ExtractedSkills, string> = {
    'Core CS': 'bg-blue-100 text-blue-700',
    'Languages': 'bg-purple-100 text-purple-700',
    'Web': 'bg-green-100 text-green-700',
    'Data': 'bg-orange-100 text-orange-700',
    'Cloud/DevOps': 'bg-cyan-100 text-cyan-700',
    'Testing': 'bg-pink-100 text-pink-700'
  }

  const toggleSkillConfidence = (skill: string) => {
    setSkillConfidence(prev => ({
      ...prev,
      [skill]: prev[skill] === 'know' ? 'practice' : 'know'
    }))
  }

  const getAllSkills = () => {
    if (!result) return []
    return Object.values(result.extractedSkills).flat()
  }

  const getWeakSkills = () => {
    return getAllSkills().filter(skill => skillConfidence[skill] === 'practice').slice(0, 3)
  }

  // Export functions
  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const formatPlan = () => {
    if (!result) return ''
    return result.plan.map(day => 
      `Day ${day.day}: ${day.title}\n${day.tasks.map(t => `  - ${t}`).join('\n')}`
    ).join('\n\n')
  }

  const formatChecklist = () => {
    if (!result) return ''
    return result.checklist.map(round => 
      `${round.round}: ${round.title}\n${round.items.map(i => `  - ${i}`).join('\n')}`
    ).join('\n\n')
  }

  const formatQuestions = () => {
    if (!result) return ''
    return result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
  }

  const downloadTXT = () => {
    if (!result) return
    const content = `PLACEMENT READINESS ANALYSIS
=============================

Company: ${result.company || 'N/A'}
Role: ${result.role || 'N/A'}
Date: ${new Date(result.createdAt).toLocaleDateString()}
Readiness Score: ${liveScore}/100

SKILLS EXTRACTED
================
${getAllSkills().map(s => `- ${s} [${skillConfidence[s] === 'know' ? '✓ Known' : '○ Needs Practice'}]`).join('\n')}

7-DAY PREPARATION PLAN
======================
${formatPlan()}

ROUND-WISE CHECKLIST
====================
${formatChecklist()}

INTERVIEW QUESTIONS
===================
${formatQuestions()}

WEAK AREAS TO FOCUS ON
======================
${getWeakSkills().join(', ') || 'None - Great job!'}
`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `placement-analysis-${result.company || 'unknown'}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {company || 'Unknown Company'} - {role || 'Unknown Role'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Analyzed on {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{liveScore}/100</div>
            <div className="text-sm text-gray-500">Live Readiness Score</div>
            {liveScore !== readinessScore && (
              <div className="text-xs text-gray-400">
                Base: {readinessScore} {liveScore > readinessScore ? '+' : ''}{liveScore - readinessScore}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Extracted Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Key Skills Extracted
              </CardTitle>
              <CardDescription>Click each skill to mark your confidence level</CardDescription>
            </CardHeader>
            <CardContent>
              {(Object.keys(extractedSkills) as Array<keyof ExtractedSkills>).map((category) => {
                const skills = extractedSkills[category]
                if (skills.length === 0) return null
                return (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={categoryColors[category]}>
                        {categoryIcons[category]}
                      </span>
                      <span className="font-medium text-gray-700">{category}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const confidence = skillConfidence[skill] || 'practice'
                        const isKnown = confidence === 'know'
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkillConfidence(skill)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                              isKnown
                                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                            }`}
                            title={isKnown ? 'Click to mark as needs practice' : 'Click to mark as known'}
                          >
                            {isKnown ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>{skill}</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{skill}</span>
                              </>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <span className="font-medium">Tip:</span> Mark skills you are confident in as "I know this" (+2 points each). Skills marked "Need practice" (-2 points each) will help identify your weak areas.
              </div>
            </CardContent>
          </Card>

          {/* Preparation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Round-wise Preparation Checklist
              </CardTitle>
              <CardDescription>Structured preparation for each interview round</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.map((round, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {round.round}: {round.title}
                    </h4>
                    <ul className="space-y-1">
                      {round.items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                7-Day Preparation Plan
              </CardTitle>
              <CardDescription>Day-by-day study schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plan.map((day) => (
                  <div key={day.day} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary">D{day.day}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{day.title}</h4>
                      <ul className="space-y-1">
                        {day.tasks.map((task, i) => (
                          <li key={i} className="text-sm text-gray-600">• {task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Score</span>
                  <span className="font-medium">35</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Skills Detected</span>
                  <span className="font-medium">+{Math.min(Object.values(extractedSkills).filter(s => s.length > 0).length * 5, 30)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Company Provided</span>
                  <span className="font-medium">{company ? '+10' : '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Role Provided</span>
                  <span className="font-medium">{role ? '+10' : '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Detailed JD (&gt;800 chars)</span>
                  <span className="font-medium">{result.jdText.length > 800 ? '+10' : '0'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-primary text-lg">{readinessScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Likely Interview Questions
              </CardTitle>
              <CardDescription>Based on detected skills</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {questions.map((question, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{question}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Export Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Export
              </CardTitle>
              <CardDescription>Copy or download your analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => copyToClipboard(formatPlan(), 'plan')}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <span>Copy 7-day plan</span>
                {copiedSection === 'plan' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={() => copyToClipboard(formatChecklist(), 'checklist')}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <span>Copy round checklist</span>
                {copiedSection === 'checklist' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={() => copyToClipboard(formatQuestions(), 'questions')}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <span>Copy 10 questions</span>
                {copiedSection === 'questions' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={downloadTXT}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download as TXT
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Next Box */}
      <Card className="mt-6 border-l-4 border-l-orange-400">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Play className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Next</h3>
              {getWeakSkills().length > 0 ? (
                <>
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Top weak areas to focus on:</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getWeakSkills().map(skill => (
                      <span key={skill} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-600 mb-3">
                  <span className="font-medium">Great job!</span> You have marked all skills as known. Focus on revision and mock interviews.
                </p>
              )}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Start Day 1 plan now.</span> Begin with basics and core CS fundamentals.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Results
