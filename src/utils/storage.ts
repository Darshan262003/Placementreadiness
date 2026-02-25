import type { AnalysisResult } from './skillExtractor'

const STORAGE_KEY = 'placement_readiness_history'

export function saveAnalysis(result: AnalysisResult): void {
  const history = getHistory()
  history.unshift(result)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function getHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
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
