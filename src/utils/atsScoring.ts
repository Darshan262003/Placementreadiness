import type { ResumeData } from '../types/aiResume'

export interface ATSScore {
  score: number
  maxScore: number
  breakdown: {
    summary: number
    projects: number
    experience: number
    skills: number
    links: number
    measurableImpact: number
    education: number
  }
  suggestions: string[]
}

export function calculateATSScore(resume: ResumeData): ATSScore {
  const breakdown = {
    summary: 0,
    projects: 0,
    experience: 0,
    skills: 0,
    links: 0,
    measurableImpact: 0,
    education: 0
  }

  // +15 if summary length is 40-120 words
  const summaryWordCount = resume.summary.trim().split(/\s+/).filter(w => w.length > 0).length
  if (summaryWordCount >= 40 && summaryWordCount <= 120) {
    breakdown.summary = 15
  }

  // +10 if at least 2 projects
  if (resume.projects.length >= 2) {
    breakdown.projects = 10
  }

  // +10 if at least 1 experience entry
  if (resume.experience.length >= 1) {
    breakdown.experience = 10
  }

  // +10 if skills list has >= 8 items
  if (resume.skills.length >= 8) {
    breakdown.skills = 10
  }

  // +10 if GitHub or LinkedIn link exists
  if (resume.links.github.trim() || resume.links.linkedin.trim()) {
    breakdown.links = 10
  }

  // +15 if any experience/project bullet contains a number (%, X, k, etc.)
  const hasMeasurableImpact = checkForMeasurableImpact(resume)
  if (hasMeasurableImpact) {
    breakdown.measurableImpact = 15
  }

  // +10 if education section has complete fields
  const hasCompleteEducation = resume.education.some(ed => 
    ed.school.trim() && ed.degree.trim() && ed.startDate.trim()
  )
  if (hasCompleteEducation) {
    breakdown.education = 10
  }

  // Calculate total score (cap at 100)
  const rawScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0)
  const score = Math.min(100, rawScore)

  // Generate suggestions based on what's missing
  const suggestions = generateSuggestions(resume, breakdown)

  return {
    score,
    maxScore: 100,
    breakdown,
    suggestions
  }
}

function checkForMeasurableImpact(resume: ResumeData): boolean {
  // Check for numbers, percentages, multipliers (k, x), or metrics in descriptions
  const impactPattern = /\d+%?|\d+\s*(k|x|times?|fold)|\$?\d+\s*(million|billion|k|thousand)|increased|decreased|improved|reduced|grew|by\s+\d+/i

  // Check experience descriptions
  for (const exp of resume.experience) {
    if (impactPattern.test(exp.description)) {
      return true
    }
  }

  // Check project descriptions
  for (const proj of resume.projects) {
    if (impactPattern.test(proj.description)) {
      return true
    }
  }

  return false
}

function generateSuggestions(resume: ResumeData, breakdown: ATSScore['breakdown']): string[] {
  const suggestions: string[] = []

  // Summary suggestion
  const summaryWordCount = resume.summary.trim().split(/\s+/).filter(w => w.length > 0).length
  if (breakdown.summary === 0) {
    if (summaryWordCount < 40) {
      suggestions.push('Write a stronger summary (40–120 words).')
    } else if (summaryWordCount > 120) {
      suggestions.push('Shorten your summary to 40–120 words.')
    }
  }

  // Projects suggestion
  if (breakdown.projects === 0) {
    suggestions.push(`Add at least ${2 - resume.projects.length} more project${resume.projects.length === 1 ? '' : 's'}.`)
  }

  // Experience suggestion
  if (breakdown.experience === 0) {
    suggestions.push('Add at least 1 work experience entry.')
  }

  // Skills suggestion
  if (breakdown.skills === 0) {
    const needed = 8 - resume.skills.length
    suggestions.push(`Add ${needed} more skill${needed === 1 ? '' : 's'} (target 8+).`)
  }

  // Links suggestion
  if (breakdown.links === 0) {
    suggestions.push('Add your GitHub or LinkedIn profile link.')
  }

  // Measurable impact suggestion
  if (breakdown.measurableImpact === 0) {
    suggestions.push('Add measurable impact (numbers, %, metrics) in your bullets.')
  }

  // Education suggestion
  if (breakdown.education === 0) {
    suggestions.push('Complete your education section with school, degree, and dates.')
  }

  // Return top 3 suggestions
  return suggestions.slice(0, 3)
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Fair'
  if (score >= 40) return 'Needs Work'
  return 'Getting Started'
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 75) return 'text-emerald-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-500'
  if (score >= 75) return 'bg-emerald-500'
  if (score >= 60) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}
