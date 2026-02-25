export interface ExtractedSkills {
  'Core CS': string[]
  'Languages': string[]
  'Web': string[]
  'Data': string[]
  'Cloud/DevOps': string[]
  'Testing': string[]
}

export type SkillConfidence = 'know' | 'practice'

export interface AnalysisResult {
  id: string
  createdAt: string
  updatedAt: string
  company: string
  role: string
  jdText: string
  extractedSkills: ExtractedSkills
  baseScore: number
  finalScore: number
  skillConfidenceMap: Record<string, SkillConfidence>
  checklist: RoundChecklist[]
  plan: DayPlan[]
  questions: string[]
  roundMapping?: RoundMappingItem[]
  companyIntel?: CompanyIntel
}

export interface RoundChecklist {
  round: string
  title: string
  items: string[]
}

export interface DayPlan {
  day: number
  title: string
  tasks: string[]
}

// Import types from companyIntel
interface RoundMappingItem {
  round: number
  title: string
  description: string
  whyItMatters: string
  focusAreas: string[]
}

interface CompanyIntel {
  name: string
  industry: string
  size: 'Startup' | 'Mid-size' | 'Enterprise'
  hiringFocus: string
}

type SkillCategory = keyof ExtractedSkills

const SKILL_CATEGORIES: Record<SkillCategory, string[]> = {
  'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
  'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
  'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
  'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
  'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
  'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
}

export function extractSkills(jdText: string): ExtractedSkills {
  const text = jdText.toLowerCase()
  const skills = {
    'Core CS': [] as string[],
    'Languages': [] as string[],
    'Web': [] as string[],
    'Data': [] as string[],
    'Cloud/DevOps': [] as string[],
    'Testing': [] as string[]
  } as ExtractedSkills

  // Check each category
  (Object.keys(SKILL_CATEGORIES) as SkillCategory[]).forEach((category: SkillCategory) => {
    SKILL_CATEGORIES[category].forEach((skill: string) => {
      // Create variations for matching
      const variations = [
        skill.toLowerCase(),
        skill.toLowerCase().replace(/\+/g, '\\+'),
        skill.toLowerCase().replace(/\//g, ' '),
        skill.toLowerCase().replace(/\./g, ' ')
      ]
      
      const found = variations.some(variation => {
        const regex = new RegExp(`\\b${variation}\\b`, 'i')
        return regex.test(text)
      })
      
      if (found) {
        (skills[category] as string[]).push(skill)
      }
    })
  })

  // If no skills found, add General fresher stack
  const hasAnySkill = Object.values(skills).some(arr => arr.length > 0)
  if (!hasAnySkill) {
    skills['Core CS'] = ['DSA', 'OOP', 'DBMS']
    skills['Languages'] = ['Java', 'Python']
  }

  return skills
}

export function calculateReadinessScore(
  skills: ExtractedSkills,
  company: string,
  role: string,
  jdText: string
): number {
  let score = 35

  // +5 per detected category (max 30)
  const categoriesPresent = Object.values(skills).filter(arr => arr.length > 0).length
  score += Math.min(categoriesPresent * 5, 30)

  // +10 if company name provided
  if (company.trim().length > 0) score += 10

  // +10 if role provided
  if (role.trim().length > 0) score += 10

  // +10 if JD length > 800 chars
  if (jdText.length > 800) score += 10

  // Cap at 100
  return Math.min(score, 100)
}

export function generateChecklist(skills: ExtractedSkills): RoundChecklist[] {
  const hasSkill = (category: keyof ExtractedSkills, skill: string) => 
    skills[category].includes(skill)

  const hasAny = (category: keyof ExtractedSkills) => skills[category].length > 0

  return [
    {
      round: 'Round 1',
      title: 'Aptitude / Basics',
      items: [
        'Practice quantitative aptitude (percentage, ratio, time-speed)',
        'Solve 10 logical reasoning puzzles',
        'Review verbal ability (grammar, comprehension)',
        'Complete 1 full aptitude mock test',
        hasAny('Core CS') ? 'Brush up on CS fundamentals basics' : 'Learn basic computer science concepts',
        'Practice online test platform navigation'
      ]
    },
    {
      round: 'Round 2',
      title: 'DSA + Core CS',
      items: [
        hasSkill('Core CS', 'DSA') ? 'Master arrays, strings, linked lists' : 'Learn basic data structures',
        hasSkill('Core CS', 'DSA') ? 'Practice trees, graphs, dynamic programming' : 'Practice array and string problems',
        hasSkill('Core CS', 'OOP') ? 'Review OOP principles (inheritance, polymorphism)' : 'Understand procedural vs OOP',
        hasSkill('Core CS', 'DBMS') ? 'Study SQL queries, normalization, indexing' : 'Learn database basics',
        hasSkill('Core CS', 'OS') ? 'Review processes, threads, memory management' : 'Understand OS fundamentals',
        hasSkill('Core CS', 'Networks') ? 'Study OSI model, TCP/IP, HTTP' : 'Learn networking basics',
        'Solve 5 problems on your weak topics'
      ]
    },
    {
      round: 'Round 3',
      title: 'Tech Interview (Projects + Stack)',
      items: [
        ...(hasAny('Languages') ? [`Deep dive into ${skills['Languages'].slice(0, 2).join(', ')} specifics`] : ['Learn one programming language deeply']),
        ...(hasAny('Web') ? [`Study ${skills['Web'].slice(0, 2).join(', ')} concepts and best practices`] : ['Understand web development basics']),
        ...(hasAny('Data') ? [`Practice ${skills['Data'].slice(0, 2).join(', ')} queries and optimization`] : ['Learn database query basics']),
        ...(hasAny('Cloud/DevOps') ? [`Review ${skills['Cloud/DevOps'].slice(0, 2).join(', ')} fundamentals`] : ['Understand deployment basics']),
        'Prepare 2 project explanations (problem, approach, impact)',
        'Practice explaining your code clearly',
        'Review system design basics (if applicable)'
      ]
    },
    {
      round: 'Round 4',
      title: 'Managerial / HR',
      items: [
        'Prepare "Tell me about yourself" pitch (2 minutes)',
        'List 5 strengths with real examples',
        'Prepare for "Why this company?" question',
        'Practice "Where do you see yourself in 5 years?"',
        'Prepare questions to ask the interviewer',
        'Review salary negotiation basics',
        'Practice behavioral questions (STAR method)'
      ]
    }
  ]
}

export function generatePlan(skills: ExtractedSkills): DayPlan[] {
  const hasAny = (category: keyof ExtractedSkills) => skills[category].length > 0
  const getSkills = (category: keyof ExtractedSkills) => skills[category].slice(0, 2).join(', ')

  return [
    {
      day: 1,
      title: 'Basics + Core CS',
      tasks: [
        'Morning: Aptitude practice (2 hours)',
        hasAny('Core CS') ? `Afternoon: Review ${getSkills('Core CS')} fundamentals` : 'Afternoon: CS basics overview',
        'Evening: Solve 3 easy coding problems'
      ]
    },
    {
      day: 2,
      title: 'Core CS Deep Dive',
      tasks: [
        'Morning: Data structures revision',
        hasSkill(skills, 'Core CS', 'DBMS') ? 'Afternoon: SQL queries and normalization' : 'Afternoon: Database basics',
        'Evening: Solve 3 medium coding problems'
      ]
    },
    {
      day: 3,
      title: 'DSA + Coding Practice',
      tasks: [
        'Morning: Arrays and strings (5 problems)',
        'Afternoon: Trees and graphs revision',
        'Evening: Attempt 1 timed coding test'
      ]
    },
    {
      day: 4,
      title: 'Advanced DSA',
      tasks: [
        'Morning: Dynamic programming patterns',
        'Afternoon: Recursion and backtracking',
        'Evening: Solve 3 hard problems'
      ]
    },
    {
      day: 5,
      title: 'Project + Resume Alignment',
      tasks: [
        ...(hasAny('Web') ? [`Morning: Review ${getSkills('Web')} project architecture`] : ['Morning: Document your projects clearly']),
        'Afternoon: Update resume with quantified achievements',
        'Evening: Practice project explanation (record yourself)'
      ]
    },
    {
      day: 6,
      title: 'Mock Interview Questions',
      tasks: [
        ...(hasAny('Languages') ? [`Morning: ${getSkills('Languages')} specific interview questions`] : ['Morning: Programming fundamentals Q&A']),
        ...(hasAny('Data') ? [`Afternoon: ${getSkills('Data')} query practice`] : ['Afternoon: Database concept questions']),
        'Evening: Full mock interview with friend/AI'
      ]
    },
    {
      day: 7,
      title: 'Revision + Weak Areas',
      tasks: [
        'Morning: Review all mistakes from the week',
        'Afternoon: Focus on identified weak topics',
        'Evening: Light revision and early sleep'
      ]
    }
  ]
}

function hasSkill(skills: ExtractedSkills, category: keyof ExtractedSkills, skill: string): boolean {
  return skills[category].includes(skill)
}

export function generateQuestions(skills: ExtractedSkills): string[] {
  const questions: string[] = []
  const hasAny = (category: keyof ExtractedSkills) => skills[category].length > 0

  // Core CS questions
  if (hasSkill(skills, 'Core CS', 'DSA')) {
    questions.push('How would you optimize search in a sorted array? Explain binary search.')
    questions.push('What is the time complexity of quicksort and when does it degrade?')
    questions.push('Explain the difference between BFS and DFS with use cases.')
  }

  if (hasSkill(skills, 'Core CS', 'OOP')) {
    questions.push('Explain the four pillars of OOP with real-world examples.')
    questions.push('What is polymorphism and how is it achieved in your preferred language?')
  }

  if (hasSkill(skills, 'Core CS', 'DBMS')) {
    questions.push('Explain database normalization and its benefits.')
    questions.push('What is the difference between INNER JOIN and LEFT JOIN?')
  }

  // Language questions
  if (hasSkill(skills, 'Languages', 'Java')) {
    questions.push('Explain the difference between ArrayList and LinkedList in Java.')
    questions.push('What is the Java Collections Framework and its main interfaces?')
  }

  if (hasSkill(skills, 'Languages', 'Python')) {
    questions.push('Explain list comprehensions in Python with an example.')
    questions.push('What are decorators in Python and how do they work?')
  }

  if (hasSkill(skills, 'Languages', 'JavaScript') || hasSkill(skills, 'Languages', 'TypeScript')) {
    questions.push('Explain closures in JavaScript with a practical example.')
    questions.push('What is the difference between == and === in JavaScript?')
    questions.push('Explain the event loop in JavaScript.')
  }

  // Web questions
  if (hasSkill(skills, 'Web', 'React')) {
    questions.push('Explain React hooks and the rules for using them.')
    questions.push('What is the Virtual DOM and how does React use it?')
    questions.push('Compare useState and useEffect with examples.')
  }

  if (hasSkill(skills, 'Web', 'Node.js')) {
    questions.push('How does Node.js handle asynchronous operations?')
    questions.push('Explain the event-driven architecture in Node.js.')
  }

  // Data questions
  if (hasSkill(skills, 'Data', 'SQL')) {
    questions.push('Explain indexing in databases and when it helps performance.')
    questions.push('What is the difference between clustered and non-clustered indexes?')
  }

  if (hasSkill(skills, 'Data', 'MongoDB')) {
    questions.push('When would you choose MongoDB over a relational database?')
    questions.push('Explain the concept of sharding in MongoDB.')
  }

  // Cloud/DevOps questions
  if (hasAny('Cloud/DevOps')) {
    questions.push('Explain the difference between Docker containers and virtual machines.')
    questions.push('What is CI/CD and why is it important?')
  }

  if (hasSkill(skills, 'Cloud/DevOps', 'AWS') || hasSkill(skills, 'Cloud/DevOps', 'Azure') || hasSkill(skills, 'Cloud/DevOps', 'GCP')) {
    questions.push('Explain the concept of auto-scaling in cloud computing.')
  }

  // Testing questions
  if (hasAny('Testing')) {
    questions.push('What is the difference between unit testing and integration testing?')
    questions.push('Explain TDD (Test Driven Development) and its benefits.')
  }

  // General questions if we need more
  if (questions.length < 10) {
    const generalQuestions = [
      'Describe a challenging project you worked on and how you overcame obstacles.',
      'How do you approach debugging a complex issue?',
      'Explain the concept of RESTful APIs.',
      'What is the difference between authentication and authorization?',
      'How do you stay updated with the latest technology trends?',
      'Describe a time when you had to learn a new technology quickly.',
      'How do you handle conflicts in a team environment?',
      'What is your approach to code reviews?'
    ]
    questions.push(...generalQuestions.slice(0, 10 - questions.length))
  }

  return questions.slice(0, 10)
}

export async function analyzeJD(company: string, role: string, jdText: string): Promise<AnalysisResult> {
  const extractedSkills = extractSkills(jdText)
  const readinessScore = calculateReadinessScore(extractedSkills, company, role, jdText)
  const checklist = generateChecklist(extractedSkills)
  const plan = generatePlan(extractedSkills)
  const questions = generateQuestions(extractedSkills)
  
  // Generate company intel and round mapping
  const { generateCompanyIntel, generateRoundMapping } = await import('./companyIntel')
  const companyIntel = generateCompanyIntel(company, jdText) || undefined
  const hasDSA = extractedSkills['Core CS'].includes('DSA')
  const hasWeb = extractedSkills['Web'].length > 0
  const hasSystemDesign = extractedSkills['Core CS'].includes('OOP') || extractedSkills['Web'].length > 0
  const roundMapping = companyIntel 
    ? generateRoundMapping(companyIntel.size, hasDSA, hasWeb, hasSystemDesign)
    : undefined

  // Initialize skill confidence map with all skills set to 'practice'
  const allSkills = Object.values(extractedSkills).flat()
  const skillConfidenceMap: Record<string, SkillConfidence> = {}
  allSkills.forEach(skill => {
    skillConfidenceMap[skill] = 'practice'
  })

  return {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company,
    role,
    jdText,
    extractedSkills,
    baseScore: readinessScore,
    finalScore: readinessScore,
    skillConfidenceMap,
    checklist,
    plan,
    questions,
    companyIntel,
    roundMapping
  }
}
