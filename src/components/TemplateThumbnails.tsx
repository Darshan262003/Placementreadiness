import { Check } from 'lucide-react'
import type { ResumeTemplate } from '../types/aiResume'

interface TemplateThumbnailsProps {
  activeTemplate: ResumeTemplate
  onSelect: (template: ResumeTemplate) => void
  accentColor: string
}

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' }
]

export function TemplateThumbnails({ activeTemplate, onSelect, accentColor }: TemplateThumbnailsProps) {
  return (
    <div className="flex gap-3">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`relative w-[120px] p-2 rounded-lg border-2 transition-all ${
            activeTemplate === template.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          {/* Template Sketch */}
          <div className="w-full aspect-[3/4] bg-white rounded border border-gray-200 overflow-hidden mb-2">
            {template.id === 'classic' && <ClassicSketch accentColor={accentColor} />}
            {template.id === 'modern' && <ModernSketch accentColor={accentColor} />}
            {template.id === 'minimal' && <MinimalSketch accentColor={accentColor} />}
          </div>
          
          {/* Label */}
          <span className="text-xs font-medium text-gray-700 block text-center">
            {template.label}
          </span>
          
          {/* Active Checkmark */}
          {activeTemplate === template.id && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

function ClassicSketch({ accentColor }: { accentColor: string }) {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-1.5">
      {/* Header */}
      <div className="text-center">
        <div className="h-2 w-16 bg-gray-800 rounded mx-auto mb-1" />
        <div className="h-1 w-12 bg-gray-400 rounded mx-auto" />
      </div>
      {/* Horizontal Rule */}
      <div className="h-0.5 bg-gray-300" style={{ backgroundColor: accentColor }} />
      {/* Sections */}
      <div className="space-y-1.5 flex-1">
        <div className="h-1.5 w-10 bg-gray-600 rounded" />
        <div className="h-0.5 bg-gray-200" />
        <div className="h-1 w-full bg-gray-100 rounded" />
        <div className="h-1 w-3/4 bg-gray-100 rounded" />
        
        <div className="h-1.5 w-10 bg-gray-600 rounded mt-2" />
        <div className="h-0.5 bg-gray-200" />
        <div className="h-1 w-full bg-gray-100 rounded" />
      </div>
    </div>
  )
}

function ModernSketch({ accentColor }: { accentColor: string }) {
  return (
    <div className="w-full h-full flex">
      {/* Left Sidebar */}
      <div 
        className="w-1/3 p-1.5 flex flex-col gap-1"
        style={{ backgroundColor: accentColor + '20' }}
      >
        <div className="h-2 w-8 rounded" style={{ backgroundColor: accentColor }} />
        <div className="h-0.5 bg-white/30 my-1" />
        <div className="h-1 w-6 bg-white/50 rounded" />
        <div className="h-1 w-5 bg-white/50 rounded" />
        <div className="h-1 w-6 bg-white/50 rounded mt-1" />
      </div>
      {/* Main Content */}
      <div className="w-2/3 p-1.5 flex flex-col gap-1">
        <div className="h-1.5 w-10 bg-gray-700 rounded" />
        <div className="h-0.5 bg-gray-200" />
        <div className="h-1 w-full bg-gray-100 rounded" />
        <div className="h-1 w-3/4 bg-gray-100 rounded" />
        
        <div className="h-1.5 w-10 bg-gray-700 rounded mt-1.5" />
        <div className="h-0.5 bg-gray-200" />
        <div className="h-1 w-full bg-gray-100 rounded" />
      </div>
    </div>
  )
}

function MinimalSketch({ accentColor: _accentColor }: { accentColor: string }) {
  return (
    <div className="w-full h-full p-2.5 flex flex-col gap-2">
      {/* Header - no borders */}
      <div className="mb-1">
        <div className="h-2 w-14 bg-gray-800 rounded mb-1" />
        <div className="h-1 w-10 bg-gray-400 rounded" />
      </div>
      
      {/* Sections with generous whitespace */}
      <div className="space-y-2 flex-1">
        <div>
          <div className="h-1.5 w-8 bg-gray-700 rounded mb-1" />
          <div className="h-1 w-full bg-gray-100 rounded" />
          <div className="h-1 w-2/3 bg-gray-100 rounded mt-0.5" />
        </div>
        
        <div className="pt-1">
          <div className="h-1.5 w-8 bg-gray-700 rounded mb-1" />
          <div className="h-1 w-full bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}
