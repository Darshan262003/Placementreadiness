import { Check } from 'lucide-react'
import type { ResumeColor } from '../types/aiResume'
import { COLOR_THEMES } from '../types/aiResume'

interface ColorPickerProps {
  activeColor: ResumeColor
  onSelect: (color: ResumeColor) => void
}

const COLORS: { id: ResumeColor; label: string }[] = [
  { id: 'teal', label: 'Teal' },
  { id: 'navy', label: 'Navy' },
  { id: 'burgundy', label: 'Burgundy' },
  { id: 'forest', label: 'Forest' },
  { id: 'charcoal', label: 'Charcoal' }
]

export function ColorPicker({ activeColor, onSelect }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      {COLORS.map((color) => (
        <button
          key={color.id}
          onClick={() => onSelect(color.id)}
          className="group relative flex flex-col items-center gap-1"
          title={color.label}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              activeColor === color.id
                ? 'border-gray-900 scale-110'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            style={{ backgroundColor: COLOR_THEMES[color.id] }}
          >
            {activeColor === color.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-4 h-4 text-white drop-shadow-md" />
              </div>
            )}
          </div>
          <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {color.label}
          </span>
        </button>
      ))}
    </div>
  )
}
