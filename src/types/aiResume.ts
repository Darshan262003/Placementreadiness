export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export interface Experience {
  id: string
  company: string
  title: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  id: string
  name: string
  description: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
}

export interface Links {
  github: string
  linkedin: string
}

export interface CategorizedSkills {
  technical: string[]
  soft: string[]
  tools: string[]
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: CategorizedSkills
  links: Links
}

export const DEFAULT_RESUME: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: ''
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
    tools: []
  },
  links: {
    github: '',
    linkedin: ''
  }
}

export const SAMPLE_RESUME: ResumeData = {
  personalInfo: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  },
  summary: 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and continuous learning.',
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015',
      endDate: '2019'
    }
  ],
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      title: 'Senior Software Engineer',
      startDate: '2021',
      endDate: 'Present',
      description: 'Led development of microservices architecture serving 1M+ users. Reduced latency by 40% through optimization.'
    },
    {
      id: '2',
      company: 'StartupXYZ',
      title: 'Software Engineer',
      startDate: '2019',
      endDate: '2021',
      description: 'Built full-stack features using React and Node.js. Implemented CI/CD pipelines.'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'Open Source Dashboard',
      description: 'A real-time analytics dashboard for monitoring application metrics.',
      techStack: ['React', 'TypeScript', 'D3.js'],
      liveUrl: 'dashboard-demo.vercel.app',
      githubUrl: 'github.com/alex/dashboard'
    }
  ],
  skills: {
    technical: ['React', 'TypeScript', 'Node.js', 'Python', 'GraphQL'],
    soft: ['Team Leadership', 'Problem Solving', 'Communication'],
    tools: ['AWS', 'PostgreSQL', 'Docker', 'Git']
  },
  links: {
    github: 'github.com/alexjohnson',
    linkedin: 'linkedin.com/in/alexjohnson'
  }
}

export const RESUME_STORAGE_KEY = 'resumeBuilderData'
export const TEMPLATE_STORAGE_KEY = 'resumeBuilderTemplate'
export const COLOR_STORAGE_KEY = 'resumeBuilderColor'

export type ResumeTemplate = 'classic' | 'modern' | 'minimal'
export type ResumeColor = 'teal' | 'navy' | 'burgundy' | 'forest' | 'charcoal'

export const DEFAULT_TEMPLATE: ResumeTemplate = 'classic'
export const DEFAULT_COLOR: ResumeColor = 'teal'

export const COLOR_THEMES: Record<ResumeColor, string> = {
  teal: 'hsl(168, 60%, 40%)',
  navy: 'hsl(220, 60%, 35%)',
  burgundy: 'hsl(345, 60%, 35%)',
  forest: 'hsl(150, 50%, 30%)',
  charcoal: 'hsl(0, 0%, 25%)'
}

export function getSavedTemplate(): ResumeTemplate {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATE
  try {
    const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY)
    if (stored && ['classic', 'modern', 'minimal'].includes(stored)) {
      return stored as ResumeTemplate
    }
    return DEFAULT_TEMPLATE
  } catch {
    return DEFAULT_TEMPLATE
  }
}

export function saveTemplate(template: ResumeTemplate): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TEMPLATE_STORAGE_KEY, template)
}

export function getSavedColor(): ResumeColor {
  if (typeof window === 'undefined') return DEFAULT_COLOR
  try {
    const stored = localStorage.getItem(COLOR_STORAGE_KEY)
    if (stored && ['teal', 'navy', 'burgundy', 'forest', 'charcoal'].includes(stored)) {
      return stored as ResumeColor
    }
    return DEFAULT_COLOR
  } catch {
    return DEFAULT_COLOR
  }
}

export function saveColor(color: ResumeColor): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(COLOR_STORAGE_KEY, color)
}

export function getResumeData(): ResumeData {
  if (typeof window === 'undefined') return DEFAULT_RESUME
  
  try {
    const stored = localStorage.getItem(RESUME_STORAGE_KEY)
    if (!stored) return DEFAULT_RESUME
    return JSON.parse(stored) as ResumeData
  } catch {
    return DEFAULT_RESUME
  }
}

export function saveResumeData(data: ResumeData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data))
}

export function clearResumeData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(RESUME_STORAGE_KEY)
}
