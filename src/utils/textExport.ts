import type { ResumeData } from '../types/aiResume'

export function generatePlainTextResume(resume: ResumeData): string {
  const lines: string[] = []

  // Name
  if (resume.personalInfo.name) {
    lines.push(resume.personalInfo.name.toUpperCase())
    lines.push('')
  }

  // Contact Info
  const contacts: string[] = []
  if (resume.personalInfo.email) contacts.push(resume.personalInfo.email)
  if (resume.personalInfo.phone) contacts.push(resume.personalInfo.phone)
  if (resume.personalInfo.location) contacts.push(resume.personalInfo.location)
  if (resume.links.github) contacts.push(resume.links.github)
  if (resume.links.linkedin) contacts.push(resume.links.linkedin)
  
  if (contacts.length > 0) {
    lines.push(contacts.join(' | '))
    lines.push('')
  }

  // Summary
  if (resume.summary.trim()) {
    lines.push('SUMMARY')
    lines.push('-'.repeat(40))
    lines.push(resume.summary.trim())
    lines.push('')
  }

  // Experience
  const validExperience = resume.experience.filter(e => e.company.trim() || e.title.trim())
  if (validExperience.length > 0) {
    lines.push('EXPERIENCE')
    lines.push('-'.repeat(40))
    
    validExperience.forEach(exp => {
      const title = exp.title || 'Position'
      const company = exp.company || 'Company'
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ') || 'Dates'
      
      lines.push(`${title} | ${company}`)
      lines.push(dates)
      
      if (exp.description.trim()) {
        // Wrap description at ~70 chars
        const wrapped = wrapText(exp.description.trim(), 70)
        lines.push(...wrapped)
      }
      lines.push('')
    })
  }

  // Education
  const validEducation = resume.education.filter(e => e.school.trim())
  if (validEducation.length > 0) {
    lines.push('EDUCATION')
    lines.push('-'.repeat(40))
    
    validEducation.forEach(edu => {
      const school = edu.school
      const degree = [edu.degree, edu.field].filter(Boolean).join(' in ')
      const dates = [edu.startDate, edu.endDate].filter(Boolean).join(' - ')
      
      lines.push(school)
      if (degree) lines.push(degree)
      if (dates) lines.push(dates)
      lines.push('')
    })
  }

  // Projects
  const validProjects = resume.projects.filter(p => p.name.trim())
  if (validProjects.length > 0) {
    lines.push('PROJECTS')
    lines.push('-'.repeat(40))
    
    validProjects.forEach(proj => {
      lines.push(proj.name)
      
      if (proj.link) {
        lines.push(`Link: ${proj.link}`)
      }
      
      if (proj.description.trim()) {
        const wrapped = wrapText(proj.description.trim(), 70)
        lines.push(...wrapped)
      }
      lines.push('')
    })
  }

  // Skills
  if (resume.skills.length > 0) {
    lines.push('SKILLS')
    lines.push('-'.repeat(40))
    lines.push(resume.skills.join(', '))
    lines.push('')
  }

  return lines.join('\n')
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach(word => {
    if ((currentLine + word).length > maxWidth) {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    } else {
      currentLine += word + ' '
    }
  })

  if (currentLine.trim()) {
    lines.push(currentLine.trim())
  }

  return lines
}

export function checkResumeCompleteness(resume: ResumeData): {
  isComplete: boolean
  missing: string[]
} {
  const missing: string[] = []

  if (!resume.personalInfo.name.trim()) {
    missing.push('Name')
  }

  const hasExperience = resume.experience.some(e => e.company.trim() || e.title.trim())
  const hasProjects = resume.projects.some(p => p.name.trim())

  if (!hasExperience && !hasProjects) {
    missing.push('At least one project or experience entry')
  }

  return {
    isComplete: missing.length === 0,
    missing
  }
}
