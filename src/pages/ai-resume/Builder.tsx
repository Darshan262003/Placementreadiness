import { useState, useMemo } from 'react'
import { Plus, Trash2, RefreshCw, Lightbulb, AlertCircle, TrendingUp, Layout } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { useResume } from '../../components/AIResumeLayout'
import { SAMPLE_RESUME, type Education, type Experience, type ResumeTemplate, type ResumeColor, type CategorizedSkills, getSavedTemplate, saveTemplate, getSavedColor, saveColor } from '../../types/aiResume'
import ResumePreview from './ResumePreview'
import { calculateATSScore, getScoreLabel, getScoreColor, getScoreBgColor } from '../../utils/atsScoring'
import { analyzeBullet } from '../../utils/bulletGuidance'
import { getTopImprovements, getPriorityColor, getPriorityLabel } from '../../utils/improvements'
import { SkillsInput } from '../../components/SkillsInput'
import { ProjectsInput } from '../../components/ProjectsInput'

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' }
]

function Builder() {
  const { resume, updateResume, updatePersonalInfo, updateLinks, setResume } = useResume()
  const [template, setTemplate] = useState<ResumeTemplate>(getSavedTemplate())
  const [color, setColor] = useState<ResumeColor>(getSavedColor())

  // Calculate ATS score
  const atsScore = useMemo(() => calculateATSScore(resume), [resume])
  
  // Get top improvements
  const improvements = useMemo(() => getTopImprovements(resume), [resume])

  const handleTemplateChange = (newTemplate: ResumeTemplate) => {
    setTemplate(newTemplate)
    saveTemplate(newTemplate)
  }

  // Color is managed in Preview page, but we keep it in state for live preview sync
  // The color change handler is in Preview.tsx
  setColor; saveColor;

  const handleLoadSample = () => {
    setResume(SAMPLE_RESUME)
  }

  const handleSkillsChange = (skills: CategorizedSkills) => {
    updateResume({ skills })
  }

  // Education handlers
  const addEducation = () => {
    const newEd: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    }
    updateResume({ education: [...resume.education, newEd] })
  }

  const updateEducation = (id: string, updates: Partial<Education>) => {
    updateResume({
      education: resume.education.map(ed => ed.id === id ? { ...ed, ...updates } : ed)
    })
  }

  const removeEducation = (id: string) => {
    updateResume({
      education: resume.education.filter(ed => ed.id !== id)
    })
  }

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    updateResume({ experience: [...resume.experience, newExp] })
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    updateResume({
      experience: resume.experience.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
    })
  }

  const removeExperience = (id: string) => {
    updateResume({
      experience: resume.experience.filter(exp => exp.id !== id)
    })
  }

  // Bullet guidance component
  const BulletGuidance = ({ text }: { text: string }) => {
    if (!text.trim()) return null
    const feedback = analyzeBullet(text)
    if (feedback.suggestions.length === 0) return null
    
    return (
      <div className="mt-2 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          {feedback.suggestions.map((suggestion, i) => (
            <p key={i}>{suggestion}</p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600">Fill in your details to build your resume</p>
        </div>
        <button
          onClick={handleLoadSample}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Load Sample Data
        </button>
      </div>

      <div className="flex gap-8">
        {/* Left: Form */}
        <div className="flex-1 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo.name}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    placeholder="john@email.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={resume.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={resume.summary}
                onChange={(e) => updateResume({ summary: e.target.value })}
                placeholder="Brief overview of your professional background and key strengths..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none resize-none"
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Education</CardTitle>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.education.map((ed) => (
                <div key={ed.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={ed.school}
                      onChange={(e) => updateEducation(ed.id, { school: e.target.value })}
                      placeholder="School/University"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                    />
                    <input
                      type="text"
                      value={ed.degree}
                      onChange={(e) => updateEducation(ed.id, { degree: e.target.value })}
                      placeholder="Degree"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                    />
                    <input
                      type="text"
                      value={ed.field}
                      onChange={(e) => updateEducation(ed.id, { field: e.target.value })}
                      placeholder="Field of Study"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ed.startDate}
                        onChange={(e) => updateEducation(ed.id, { startDate: e.target.value })}
                        placeholder="Start"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                      />
                      <input
                        type="text"
                        value={ed.endDate}
                        onChange={(e) => updateEducation(ed.id, { endDate: e.target.value })}
                        placeholder="End"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeEducation(ed.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Experience</CardTitle>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                    />
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                      placeholder="Job Title"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="Start"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                      />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        placeholder="End"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                      />
                    </div>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    placeholder="Job description and achievements..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none resize-none"
                  />
                  <BulletGuidance text={exp.description} />
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectsInput
                projects={resume.projects}
                onChange={(projects) => updateResume({ projects })}
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsInput
                skills={resume.skills}
                onChange={handleSkillsChange}
              />
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="text"
                  value={resume.links.github}
                  onChange={(e) => updateLinks({ github: e.target.value })}
                  placeholder="github.com/username"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={resume.links.linkedin}
                  onChange={(e) => updateLinks({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: ATS Score + Improvements + Template + Preview */}
        <div className="w-[450px] sticky top-24 h-fit space-y-4">
          {/* Template Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Template
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

          {/* ATS Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>ATS Readiness Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(atsScore.score)}`}>
                  {atsScore.score}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score Meter */}
              <div className="relative">
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getScoreBgColor(atsScore.score)} transition-all duration-500`}
                    style={{ width: `${atsScore.score}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>0</span>
                  <span className={`font-medium ${getScoreColor(atsScore.score)}`}>
                    {getScoreLabel(atsScore.score)}
                  </span>
                  <span>100</span>
                </div>
              </div>

              {/* Suggestions */}
              {atsScore.suggestions.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Suggestions</span>
                  </div>
                  <ul className="space-y-2">
                    {atsScore.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Score Breakdown */}
              {atsScore.score >= 75 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-green-600 font-medium">
                    Great job! Your resume is ATS-ready.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top 3 Improvements */}
          {improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Top 3 Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {improvements.map((improvement, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(improvement.priority)}`}>
                          {getPriorityLabel(improvement.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{improvement.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{improvement.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Live Preview</span>
              <span className="text-xs text-gray-400">{template} template</span>
            </div>
            <div className="p-6">
              <ResumePreview resume={resume} template={template} color={color} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Builder
