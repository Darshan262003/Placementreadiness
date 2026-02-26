import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, X, Github, ExternalLink } from 'lucide-react'
import type { Project } from '../types/aiResume'

interface ProjectsInputProps {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

const MAX_DESCRIPTION_LENGTH = 200

export function ProjectsInput({ projects, onChange }: ProjectsInputProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [techInputs, setTechInputs] = useState<Record<string, string>>({})

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      techStack: [],
      liveUrl: '',
      githubUrl: ''
    }
    onChange([...projects, newProject])
    setExpandedId(newProject.id)
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(projects.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const removeProject = (id: string) => {
    onChange(projects.filter(p => p.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const addTechStack = (projectId: string, tech: string) => {
    const trimmed = tech.trim()
    if (!trimmed) return

    const project = projects.find(p => p.id === projectId)
    if (!project || project.techStack.includes(trimmed)) return

    updateProject(projectId, { techStack: [...project.techStack, trimmed] })
    setTechInputs({ ...techInputs, [projectId]: '' })
  }

  const removeTechStack = (projectId: string, tech: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    updateProject(projectId, {
      techStack: project.techStack.filter(t => t !== tech)
    })
  }

  const handleTechKeyDown = (projectId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechStack(projectId, techInputs[projectId] || '')
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <button
        onClick={addProject}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </button>

      {/* Project List */}
      {projects.map((project) => {
        const isExpanded = expandedId === project.id
        const charCount = project.description.length
        const isNearLimit = charCount > MAX_DESCRIPTION_LENGTH * 0.8

        return (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Header - Always visible */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : project.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
                <span className="font-medium text-gray-900">
                  {project.name || 'Untitled Project'}
                </span>
                {project.techStack.length > 0 && (
                  <span className="text-xs text-gray-500">
                    ({project.techStack.length} technologies)
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeProject(project.id)
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-4 space-y-4">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                    placeholder="e.g., E-Commerce Dashboard"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <span className={`text-xs ${isNearLimit ? 'text-amber-600' : 'text-gray-400'}`}>
                      {charCount}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                  <textarea
                    value={project.description}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH)
                      updateProject(project.id, { description: text })
                    }}
                    placeholder="Brief description of the project..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none resize-none"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechStack(project.id, tech)}
                          className="w-4 h-4 flex items-center justify-center rounded hover:bg-blue-100 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={techInputs[project.id] || ''}
                    onChange={(e) => setTechInputs({ ...techInputs, [project.id]: e.target.value })}
                    onKeyDown={(e) => handleTechKeyDown(project.id, e)}
                    placeholder="Add technology and press Enter..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none text-sm"
                  />
                </div>

                {/* URLs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Live URL
                      </span>
                    </label>
                    <input
                      type="text"
                      value={project.liveUrl || ''}
                      onChange={(e) => updateProject(project.id, { liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        GitHub URL
                      </span>
                    </label>
                    <input
                      type="text"
                      value={project.githubUrl || ''}
                      onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
