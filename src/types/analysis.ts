// Strict Analysis Entry Schema
// All fields are required, use empty strings/arrays as defaults

export type SkillConfidence = 'know' | 'practice'

export interface ExtractedSkills {
  coreCS: string[]
  languages: string[]
  web: string[]
  data: string[]
  cloud: string[]
  testing: string[]
  other: string[]
}

export interface RoundMappingItem {
  round: number
  roundTitle: string
  focusAreas: string[]
  whyItMatters: string
}

export interface ChecklistItem {
  roundTitle: string
  items: string[]
}

export interface PlanDay {
  day: number
  focus: string
  tasks: string[]
}

export interface AnalysisEntry {
  // Identifiers
  id: string
  createdAt: string
  updatedAt: string

  // Input fields
  company: string
  role: string
  jdText: string

  // Extracted data
  extractedSkills: ExtractedSkills

  // Generated content
  roundMapping: RoundMappingItem[]
  checklist: ChecklistItem[]
  plan7Days: PlanDay[]
  questions: string[]

  // Scoring
  baseScore: number
  skillConfidenceMap: Record<string, SkillConfidence>
  finalScore: number
}

// Default/Empty values for schema compliance
export const DEFAULT_EXTRACTED_SKILLS: ExtractedSkills = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: []
}

export const DEFAULT_SKILL_CONFIDENCE_MAP: Record<string, SkillConfidence> = {}

// Validation helper
export function isValidAnalysisEntry(entry: unknown): entry is AnalysisEntry {
  if (!entry || typeof entry !== 'object') return false
  
  const e = entry as Partial<AnalysisEntry>
  
  // Required string fields
  if (typeof e.id !== 'string') return false
  if (typeof e.createdAt !== 'string') return false
  if (typeof e.updatedAt !== 'string') return false
  if (typeof e.company !== 'string') return false
  if (typeof e.role !== 'string') return false
  if (typeof e.jdText !== 'string') return false
  if (typeof e.baseScore !== 'number') return false
  if (typeof e.finalScore !== 'number') return false
  
  // Required object fields
  if (!e.extractedSkills || typeof e.extractedSkills !== 'object') return false
  if (!Array.isArray(e.roundMapping)) return false
  if (!Array.isArray(e.checklist)) return false
  if (!Array.isArray(e.plan7Days)) return false
  if (!Array.isArray(e.questions)) return false
  if (!e.skillConfidenceMap || typeof e.skillConfidenceMap !== 'object') return false
  
  return true
}

// Migration helper to ensure old entries conform to new schema
export function migrateAnalysisEntry(entry: Partial<AnalysisEntry>): AnalysisEntry {
  const now = new Date().toISOString()
  
  return {
    id: entry.id || Date.now().toString(),
    createdAt: entry.createdAt || now,
    updatedAt: entry.updatedAt || now,
    company: entry.company || '',
    role: entry.role || '',
    jdText: entry.jdText || '',
    extractedSkills: {
      coreCS: entry.extractedSkills?.coreCS || [],
      languages: entry.extractedSkills?.languages || [],
      web: entry.extractedSkills?.web || [],
      data: entry.extractedSkills?.data || [],
      cloud: entry.extractedSkills?.cloud || [],
      testing: entry.extractedSkills?.testing || [],
      other: entry.extractedSkills?.other || []
    },
    roundMapping: entry.roundMapping || [],
    checklist: entry.checklist || [],
    plan7Days: entry.plan7Days || [],
    questions: entry.questions || [],
    baseScore: entry.baseScore || 35,
    skillConfidenceMap: entry.skillConfidenceMap || {},
    finalScore: entry.finalScore || entry.baseScore || 35
  }
}
