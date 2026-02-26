export interface BulletFeedback {
  hasActionVerb: boolean
  hasMeasurableImpact: boolean
  suggestions: string[]
}

const ACTION_VERBS = [
  'built', 'developed', 'designed', 'implemented', 'led', 'improved', 'created', 'optimized',
  'automated', 'managed', 'architected', 'engineered', 'launched', 'delivered', 'spearheaded',
  'streamlined', 'reduced', 'increased', 'enhanced', 'refactored', 'deployed', 'integrated',
  'mentored', 'collaborated', 'coordinated', 'negotiated', 'analyzed', 'researched', 'tested',
  'maintained', 'supported', 'trained', 'wrote', 'documented', 'presented', 'achieved',
  'accomplished', 'completed', 'executed', 'facilitated', 'generated', 'initiated',
  'modernized', 'oversaw', 'pioneered', 'resolved', 'revamped', 'scaled', 'secured',
  'transformed', 'upgraded', 'validated', 'won'
]

const MEASURABLE_INDICATORS = /\d+%?|\d+\s*(k|x|times?|fold|million|billion)|\$\d+|\d+\s*(users?|customers?|clients?|requests?|queries?|seconds?|minutes?|hours?|days?|months?|years?)/i

export function analyzeBullet(text: string): BulletFeedback {
  const trimmedText = text.trim()
  
  if (!trimmedText) {
    return {
      hasActionVerb: false,
      hasMeasurableImpact: false,
      suggestions: []
    }
  }

  // Check for action verb at start
  const firstWord = trimmedText.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '')
  const hasActionVerb = ACTION_VERBS.includes(firstWord)

  // Check for measurable impact
  const hasMeasurableImpact = MEASURABLE_INDICATORS.test(trimmedText)

  // Generate suggestions
  const suggestions: string[] = []
  
  if (!hasActionVerb) {
    suggestions.push('Start with a strong action verb.')
  }
  
  if (!hasMeasurableImpact) {
    suggestions.push('Add measurable impact (numbers).')
  }

  return {
    hasActionVerb,
    hasMeasurableImpact,
    suggestions
  }
}

export function getActionVerbSuggestions(): string[] {
  return [
    'Built', 'Developed', 'Designed', 'Implemented', 'Led', 
    'Improved', 'Created', 'Optimized', 'Automated', 'Launched'
  ]
}
