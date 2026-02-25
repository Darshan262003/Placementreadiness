export interface TestItem {
  id: string
  label: string
  hint: string
  checked: boolean
}

export interface TestChecklist {
  items: TestItem[]
  lastUpdated: string
}

export const DEFAULT_TEST_ITEMS: TestItem[] = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Go to /analyzer, try to submit without JD. Should prevent submission.',
    checked: false
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Type <200 chars in JD field. Orange warning banner should appear.',
    checked: false
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Analyze JD with React, Node.js, SQL. Verify skills appear in correct categories.',
    checked: false
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Compare Amazon (Enterprise, 4 rounds) vs Unknown Startup (3 rounds).',
    checked: false
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Same JD should give same baseScore every time.',
    checked: false
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'On /results, click skills. finalScore should update immediately (+2/-2).',
    checked: false
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page. Toggles and score should remain.',
    checked: false
  },
  {
    id: 'history-load',
    label: 'History saves and loads correctly',
    hint: 'Create analysis, go to /history, click entry. Should load correctly.',
    checked: false
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click "Copy 7-day plan", paste somewhere. Should match plan content.',
    checked: false
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open DevTools, navigate through /analyzer, /results, /history. No red errors.',
    checked: false
  }
]

export const TEST_CHECKLIST_KEY = 'placement_test_checklist'

export function getDefaultChecklist(): TestChecklist {
  return {
    items: DEFAULT_TEST_ITEMS.map(item => ({ ...item })),
    lastUpdated: new Date().toISOString()
  }
}

export function getTestChecklist(): TestChecklist {
  if (typeof window === 'undefined') return getDefaultChecklist()
  
  try {
    const stored = localStorage.getItem(TEST_CHECKLIST_KEY)
    if (!stored) return getDefaultChecklist()
    
    const parsed = JSON.parse(stored)
    if (!parsed.items || !Array.isArray(parsed.items)) return getDefaultChecklist()
    
    // Ensure all required items exist
    const storedIds = new Set(parsed.items.map((i: TestItem) => i.id))
    const defaultIds = new Set(DEFAULT_TEST_ITEMS.map(i => i.id))
    
    // Add missing items
    DEFAULT_TEST_ITEMS.forEach(item => {
      if (!storedIds.has(item.id)) {
        parsed.items.push({ ...item })
      }
    })
    
    // Remove extra items not in default
    parsed.items = parsed.items.filter((item: TestItem) => defaultIds.has(item.id))
    
    return parsed as TestChecklist
  } catch {
    return getDefaultChecklist()
  }
}

export function saveTestChecklist(checklist: TestChecklist): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify({
    ...checklist,
    lastUpdated: new Date().toISOString()
  }))
}

export function resetTestChecklist(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(getDefaultChecklist()))
}

export function getPassedCount(checklist: TestChecklist): number {
  return checklist.items.filter(item => item.checked).length
}

export function isChecklistComplete(checklist: TestChecklist): boolean {
  return getPassedCount(checklist) === checklist.items.length
}
