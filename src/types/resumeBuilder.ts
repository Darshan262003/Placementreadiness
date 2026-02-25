export type StepStatus = 'locked' | 'active' | 'completed' | 'error'
export type BuildStatus = 'idle' | 'building' | 'success' | 'error'

export interface StepArtifact {
  imageData: string  // base64 screenshot
  uploadedAt: string
  status: 'success' | 'error'
  notes?: string
}

export interface ResumeBuilderStep {
  id: string
  number: number
  title: string
  route: string
  status: StepStatus
  artifact?: StepArtifact
  lovablePrompt?: string
}

export interface ResumeBuilderState {
  currentStep: number
  steps: ResumeBuilderStep[]
  startedAt: string
  updatedAt: string
}

export interface ProofSubmission {
  lovableLink: string
  githubLink: string
  deployLink: string
  submittedAt?: string
}

export const RESUME_BUILDER_KEY = 'resume_builder_state'
export const RESUME_BUILDER_PROOF_KEY = 'resume_builder_proof'

export const DEFAULT_STEPS: Omit<ResumeBuilderStep, 'status'>[] = [
  { id: 'problem', number: 1, title: 'Problem Definition', route: '/rb/01-problem', lovablePrompt: 'Create a landing page for an AI Resume Builder. Header: "AI Resume Builder — Land Your Dream Job in Minutes". Subheader: "AI-powered resume optimization with ATS scoring and recruiter feedback". Add two CTAs: "Start Building Free" and "See Example Resume". Include a hero image placeholder.' },
  { id: 'market', number: 2, title: 'Market Research', route: '/rb/02-market', lovablePrompt: 'Add a "Why It Works" section below the hero. Three cards: "ATS Optimization" (98% pass rate), "Recruiter-Approved Templates" (used by top companies), "AI Suggestions" (real-time improvements). Use icons and brief descriptions.' },
  { id: 'architecture', number: 3, title: 'System Architecture', route: '/rb/03-architecture', lovablePrompt: 'Add a "How It Works" section with 4 steps: 1) Upload or create resume, 2) AI analyzes and scores, 3) Get personalized suggestions, 4) Download ATS-optimized PDF. Use a horizontal timeline or step indicators.' },
  { id: 'hld', number: 4, title: 'High Level Design', route: '/rb/04-hld', lovablePrompt: 'Add a features grid section: "Everything You Need". 6 features in 2 rows: Smart Templates, ATS Score Checker, AI Writing Assistant, Keyword Optimization, Real-time Preview, One-click Export. Each with icon and one-line description.' },
  { id: 'lld', number: 5, title: 'Low Level Design', route: '/rb/05-lld', lovablePrompt: 'Add a pricing section with 3 tiers: Free (basic templates, 3 resumes), Pro $9/mo (unlimited, ATS checker, AI suggestions), Enterprise $29/mo (team features, API access). Highlight Pro as "Most Popular".' },
  { id: 'build', number: 6, title: 'Build Phase', route: '/rb/06-build', lovablePrompt: 'Add testimonials section: "Loved by Job Seekers". 3 testimonial cards with quotes, names, and roles. Include star ratings. Add company logos section below (Google, Microsoft, Amazon placeholders).' },
  { id: 'test', number: 7, title: 'Testing', route: '/rb/07-test', lovablePrompt: 'Add FAQ section with 5 questions: How does AI improve my resume? Is my data secure? Can I cancel anytime? What formats can I export? Do you offer refunds? Use accordion or expandable cards.' },
  { id: 'ship', number: 8, title: 'Ship', route: '/rb/08-ship', lovablePrompt: 'Add final CTA section: "Ready to Land Your Dream Job?" Large heading, subtext about starting free, two buttons: "Create Free Resume" (primary) and "Talk to Sales" (secondary). Add footer with links and copyright.' },
]

export function getDefaultState(): ResumeBuilderState {
  return {
    currentStep: 1,
    steps: DEFAULT_STEPS.map((step, index) => ({
      ...step,
      status: index === 0 ? 'active' : 'locked'
    })),
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export function getResumeBuilderState(): ResumeBuilderState {
  if (typeof window === 'undefined') return getDefaultState()
  
  try {
    const stored = localStorage.getItem(RESUME_BUILDER_KEY)
    if (!stored) return getDefaultState()
    
    const parsed = JSON.parse(stored)
    if (!parsed.steps || !Array.isArray(parsed.steps)) return getDefaultState()
    
    // Ensure all steps exist
    const storedIds = new Set(parsed.steps.map((s: ResumeBuilderStep) => s.id))
    const defaultIds = new Set(DEFAULT_STEPS.map(s => s.id))
    
    // Add missing steps
    DEFAULT_STEPS.forEach((step, index) => {
      if (!storedIds.has(step.id)) {
        parsed.steps.splice(index, 0, {
          ...step,
          status: index < parsed.currentStep ? 'completed' : index === parsed.currentStep ? 'active' : 'locked'
        })
      }
    })
    
    // Remove extra steps
    parsed.steps = parsed.steps.filter((step: ResumeBuilderStep) => defaultIds.has(step.id))
    
    return parsed as ResumeBuilderState
  } catch {
    return getDefaultState()
  }
}

export function saveResumeBuilderState(state: ResumeBuilderState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RESUME_BUILDER_KEY, JSON.stringify({
    ...state,
    updatedAt: new Date().toISOString()
  }))
}

export function resetResumeBuilderState(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RESUME_BUILDER_KEY, JSON.stringify(getDefaultState()))
}

export function canAccessStep(state: ResumeBuilderState, stepNumber: number): boolean {
  // Can access current step or any completed step
  return stepNumber <= state.currentStep
}

export function completeStep(state: ResumeBuilderState, stepNumber: number, artifact: StepArtifact): ResumeBuilderState {
  const newState = { ...state }
  const stepIndex = newState.steps.findIndex(s => s.number === stepNumber)
  
  if (stepIndex === -1) return state
  
  // Mark current step as completed
  newState.steps[stepIndex] = {
    ...newState.steps[stepIndex],
    status: 'completed',
    artifact
  }
  
  // Unlock next step if exists
  if (stepIndex < newState.steps.length - 1) {
    newState.steps[stepIndex + 1] = {
      ...newState.steps[stepIndex + 1],
      status: 'active'
    }
    newState.currentStep = stepNumber + 1
  }
  
  newState.updatedAt = new Date().toISOString()
  return newState
}

export function getProofSubmission(): ProofSubmission | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(RESUME_BUILDER_PROOF_KEY)
    if (!stored) return null
    return JSON.parse(stored) as ProofSubmission
  } catch {
    return null
  }
}

export function saveProofSubmission(submission: ProofSubmission): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RESUME_BUILDER_PROOF_KEY, JSON.stringify({
    ...submission,
    submittedAt: new Date().toISOString()
  }))
}

export function getStepStatus(state: ResumeBuilderState, stepNumber: number): StepStatus {
  const step = state.steps.find(s => s.number === stepNumber)
  return step?.status || 'locked'
}

export function isStepCompleted(state: ResumeBuilderState, stepNumber: number): boolean {
  return getStepStatus(state, stepNumber) === 'completed'
}

export function getCompletedStepsCount(state: ResumeBuilderState): number {
  return state.steps.filter(s => s.status === 'completed').length
}
