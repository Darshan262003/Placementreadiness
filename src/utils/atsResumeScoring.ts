import type { ResumeData } from '../types/aiResume'

export interface ATSResumeScore {
  score: number
  maxScore: number
  label: string
  color: string
  breakdown: {
    name: number
    email: number
    summary: number
    experience: number
    education: number
    skills: number
    projects: number
    phone: number
    linkedin: number
    github: number
    actionVerbs: number
  }
  suggestions: string[]
}

const ACTION_VERBS = [
  'built', 'led', 'designed', 'improved', 'developed', 'created', 'implemented',
  'managed', 'launched', 'optimized', 'reduced', 'increased', 'achieved',
  'delivered', 'spearheaded', 'engineered', 'architected', 'automated',
  'streamlined', 'coordinated', 'mentored', 'collaborated', 'negotiated'
]

export function calculateATSResumeScore(resume: ResumeData): ATSResumeScore {
  const breakdown = {
    name: 0,
    email: 0,
    summary: 0,
    experience: 0,
    education: 0,
    skills: 0,
    projects: 0,
    phone: 0,
    linkedin: 0,
    github: 0,
    actionVerbs: 0
  }

  // +10 if name provided
  if (resume.personalInfo.name.trim()) {
    breakdown.name = 10
  }

  // +10 if email provided
  if (resume.personalInfo.email.trim()) {
    breakdown.email = 10
  }

  // +10 if summary > 50 chars
  if (resume.summary.trim().length > 50) {
    breakdown.summary = 10
  }

  // +15 if at least 1 experience entry with bullets (description)
  const hasExperienceWithBullets = resume.experience.some(
    exp => (exp.company.trim() || exp.title.trim()) && exp.description.trim().length > 0
  )
  if (hasExperienceWithBullets) {
    breakdown.experience = 15
  }

  // +10 if at least 1 education entry
  const hasEducation = resume.education.some(ed => ed.school.trim())
  if (hasEducation) {
    breakdown.education = 10
  }

  // +10 if at least 5 skills added (total across all categories)
  const totalSkills = resume.skills.technical.length + resume.skills.soft.length + resume.skills.tools.length
  if (totalSkills >= 5) {
    breakdown.skills = 10
  }

  // +10 if at least 1 project added
  const hasProject = resume.projects.some(proj => proj.name.trim())
  if (hasProject) {
    breakdown.projects = 10
  }

  // +5 if phone provided
  if (resume.personalInfo.phone.trim()) {
    breakdown.phone = 5
  }

  // +5 if LinkedIn provided
  if (resume.links.linkedin.trim()) {
    breakdown.linkedin = 5
  }

  // +5 if GitHub provided
  if (resume.links.github.trim()) {
    breakdown.github = 5
  }

  // +10 if summary contains action verbs
  const summaryLower = resume.summary.toLowerCase()
  const hasActionVerb = ACTION_VERBS.some(verb => summaryLower.includes(verb))
  if (hasActionVerb) {
    breakdown.actionVerbs = 10
  }

  // Calculate total score
  const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  // Get label and color based on score
  const { label, color } = getScoreLabelAndColor(score)

  // Generate suggestions
  const suggestions = generateSuggestions(resume, breakdown)

  return {
    score,
    maxScore: 100,
    label,
    color,
    breakdown,
    suggestions
  }
}

function getScoreLabelAndColor(score: number): { label: string; color: string } {
  if (score <= 40) {
    return { label: 'Needs Work', color: '#ef4444' } // Red
  } else if (score <= 70) {
    return { label: 'Getting There', color: '#f59e0b' } // Amber
  } else {
    return { label: 'Strong Resume', color: '#22c55e' } // Green
  }
}

function generateSuggestions(resume: ResumeData, breakdown: ATSResumeScore['breakdown']): string[] {
  const suggestions: string[] = []

  if (breakdown.name === 0) {
    suggestions.push('Add your name (+10 points)')
  }

  if (breakdown.email === 0) {
    suggestions.push('Add your email address (+10 points)')
  }

  if (breakdown.summary === 0) {
    suggestions.push('Write a professional summary of 50+ characters (+10 points)')
  }

  if (breakdown.actionVerbs === 0 && resume.summary.trim().length > 0) {
    suggestions.push('Add action verbs to your summary like "built", "led", "designed" (+10 points)')
  }

  if (breakdown.experience === 0) {
    suggestions.push('Add work experience with bullet points (+15 points)')
  }

  if (breakdown.education === 0) {
    suggestions.push('Add your education (+10 points)')
  }

  const totalSkills = resume.skills.technical.length + resume.skills.soft.length + resume.skills.tools.length
  if (totalSkills < 5) {
    const needed = 5 - totalSkills
    suggestions.push(`Add ${needed} more skill${needed === 1 ? '' : 's'} (+${needed * 2} points)`)
  }

  if (breakdown.projects === 0) {
    suggestions.push('Add at least one project (+10 points)')
  }

  if (breakdown.phone === 0) {
    suggestions.push('Add your phone number (+5 points)')
  }

  if (breakdown.linkedin === 0) {
    suggestions.push('Add your LinkedIn profile (+5 points)')
  }

  if (breakdown.github === 0) {
    suggestions.push('Add your GitHub profile (+5 points)')
  }

  return suggestions.slice(0, 5) // Return top 5 suggestions
}

// Circular progress calculation
export function getCircularProgress(score: number): { circumference: number; offset: number } {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  return { circumference, offset }
}
