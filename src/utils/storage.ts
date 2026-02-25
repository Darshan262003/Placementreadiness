import type { AnalysisResult } from './skillExtractor'

const STORAGE_KEY = 'placement_readiness_history'

export function saveAnalysis(result: AnalysisResult): void {
  const history = getHistory()
  history.unshift(result)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function getHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      // Corrupted data - clear it
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    
    // Basic validation - ensure each entry has required fields
    const validEntries = parsed.filter((entry: unknown) => {
      return entry && 
             typeof entry === 'object' &&
             typeof (entry as AnalysisResult).id === 'string' &&
             typeof (entry as AnalysisResult).jdText === 'string'
    })
    
    // If some entries were filtered out, save cleaned history
    if (validEntries.length < parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries))
    }
    
    return validEntries as AnalysisResult[]
  } catch (error) {
    console.error('Error loading history:', error)
    return []
  }
}

export function getAnalysisById(id: string): AnalysisResult | null {
  const history = getHistory()
  return history.find(item => item.id === id) || null
}

export function updateAnalysis(updatedResult: AnalysisResult): void {
  const history = getHistory()
  const index = history.findIndex(item => item.id === updatedResult.id)
  if (index !== -1) {
    history[index] = updatedResult
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }
}

export function deleteAnalysis(id: string): void {
  const history = getHistory()
  const filtered = history.filter(item => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
