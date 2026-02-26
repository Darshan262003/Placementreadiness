import type { ResumeData } from '../types/aiResume'

export interface Improvement {
  priority: 'high' | 'medium' | 'low'
  message: string
  action: string
}

export function getTopImprovements(resume: ResumeData): Improvement[] {
  const improvements: Improvement[] = []

  // Check projects count
  const validProjects = resume.projects.filter(p => p.name.trim()).length
  if (validProjects < 2) {
    improvements.push({
      priority: 'high',
      message: `You have ${validProjects} project${validProjects === 1 ? '' : 's'}.`,
      action: `Add ${2 - validProjects} more project${validProjects === 1 ? '' : 's'} to showcase your work.`
    })
  }

  // Check for measurable impact
  const hasMeasurableImpact = checkForMeasurableImpact(resume)
  if (!hasMeasurableImpact) {
    improvements.push({
      priority: 'high',
      message: 'No measurable impact detected.',
      action: 'Add numbers, percentages, or metrics to your experience and projects.'
    })
  }

  // Check summary length
  const summaryWordCount = resume.summary.trim().split(/\s+/).filter(w => w.length > 0).length
  if (summaryWordCount < 40) {
    improvements.push({
      priority: 'medium',
      message: `Summary is ${summaryWordCount} words.`,
      action: 'Expand to 40-120 words for better impact.'
    })
  }

  // Check skills count
  if (resume.skills.length < 8) {
    const needed = 8 - resume.skills.length
    improvements.push({
      priority: 'medium',
      message: `You have ${resume.skills.length} skills.`,
      action: `Add ${needed} more skill${needed === 1 ? '' : 's'} (target 8+).`
    })
  }

  // Check experience
  const validExperience = resume.experience.filter(e => e.company.trim() || e.title.trim()).length
  if (validExperience === 0) {
    improvements.push({
      priority: 'high',
      message: 'No work experience added.',
      action: 'Add internship, freelance, or project work experience.'
    })
  }

  // Check links
  if (!resume.links.github.trim() && !resume.links.linkedin.trim()) {
    improvements.push({
      priority: 'low',
      message: 'No professional links.',
      action: 'Add your GitHub or LinkedIn profile.'
    })
  }

  // Sort by priority and return top 3
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return improvements
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 3)
}

function checkForMeasurableImpact(resume: ResumeData): boolean {
  const impactPattern = /\d+%?|\d+\s*(k|x|times?|fold)|\$?\d+\s*(million|billion|k|thousand)|increased|decreased|improved|reduced|grew|by\s+\d+/i

  for (const exp of resume.experience) {
    if (impactPattern.test(exp.description)) return true
  }

  for (const proj of resume.projects) {
    if (impactPattern.test(proj.description)) return true
  }

  return false
}

export function getPriorityColor(priority: Improvement['priority']): string {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50'
    case 'medium': return 'text-amber-600 bg-amber-50'
    case 'low': return 'text-blue-600 bg-blue-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export function getPriorityLabel(priority: Improvement['priority']): string {
  switch (priority) {
    case 'high': return 'High Impact'
    case 'medium': return 'Medium Impact'
    case 'low': return 'Low Impact'
    default: return 'Suggestion'
  }
}
