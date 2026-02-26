import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import type { CategorizedSkills } from '../types/aiResume'

interface SkillsInputProps {
  skills: CategorizedSkills
  onChange: (skills: CategorizedSkills) => void
}

const SKILL_CATEGORIES = [
  { key: 'technical' as const, label: 'Technical Skills', placeholder: 'Add technical skill...' },
  { key: 'soft' as const, label: 'Soft Skills', placeholder: 'Add soft skill...' },
  { key: 'tools' as const, label: 'Tools & Technologies', placeholder: 'Add tool or technology...' }
]

const SUGGESTED_SKILLS = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft: ['Team Leadership', 'Problem Solving'],
  tools: ['Git', 'Docker', 'AWS']
}

export function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [inputs, setInputs] = useState({ technical: '', soft: '', tools: '' })
  const [isSuggesting, setIsSuggesting] = useState(false)

  const addSkill = (category: keyof CategorizedSkills, skill: string) => {
    const trimmed = skill.trim()
    if (!trimmed) return
    if (skills[category].includes(trimmed)) return

    onChange({
      ...skills,
      [category]: [...skills[category], trimmed]
    })
  }

  const removeSkill = (category: keyof CategorizedSkills, skill: string) => {
    onChange({
      ...skills,
      [category]: skills[category].filter(s => s !== skill)
    })
  }

  const handleKeyDown = (category: keyof CategorizedSkills, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(category, inputs[category])
      setInputs({ ...inputs, [category]: '' })
    }
  }

  const handleSuggest = async () => {
    setIsSuggesting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newSkills = { ...skills }
    Object.entries(SUGGESTED_SKILLS).forEach(([category, suggested]) => {
      const cat = category as keyof CategorizedSkills
      suggested.forEach(skill => {
        if (!newSkills[cat].includes(skill)) {
          newSkills[cat] = [...newSkills[cat], skill]
        }
      })
    })
    
    onChange(newSkills)
    setIsSuggesting(false)
  }

  return (
    <div className="space-y-6">
      {/* Suggest Button */}
      <button
        onClick={handleSuggest}
        disabled={isSuggesting}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSuggesting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Suggesting...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Suggest Skills
          </>
        )}
      </button>

      {/* Skill Categories */}
      {SKILL_CATEGORIES.map(({ key, label, placeholder }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
            <span className="text-xs text-gray-500">
              {skills[key].length}
            </span>
          </div>

          {/* Skill Pills */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
            {skills[key].map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(key, skill)}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Input */}
          <input
            type="text"
            value={inputs[key]}
            onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
            onKeyDown={(e) => handleKeyDown(key, e)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Press Enter to add</p>
        </div>
      ))}
    </div>
  )
}
