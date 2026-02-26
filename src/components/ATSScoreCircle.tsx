import { useMemo } from 'react'
import { calculateATSResumeScore, getCircularProgress } from '../utils/atsResumeScoring'
import type { ResumeData } from '../types/aiResume'

interface ATSScoreCircleProps {
  resume: ResumeData
}

export function ATSScoreCircle({ resume }: ATSScoreCircleProps) {
  const scoreData = useMemo(() => calculateATSResumeScore(resume), [resume])
  const { circumference, offset } = useMemo(() => getCircularProgress(scoreData.score), [scoreData.score])

  return (
    <div className="flex flex-col items-center">
      {/* Circular Progress */}
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={scoreData.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{scoreData.score}</span>
          <span className="text-[10px] text-gray-500">/ 100</span>
        </div>
      </div>

      {/* Label */}
      <div 
        className="mt-2 px-3 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: scoreData.color + '20',
          color: scoreData.color
        }}
      >
        {scoreData.label}
      </div>
    </div>
  )
}

export function ATSScoreDetails({ resume }: ATSScoreCircleProps) {
  const scoreData = useMemo(() => calculateATSResumeScore(resume), [resume])

  if (scoreData.suggestions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-green-600 font-medium">Great job! Your resume is ATS-ready.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Improvements</h4>
      <ul className="space-y-2">
        {scoreData.suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}
