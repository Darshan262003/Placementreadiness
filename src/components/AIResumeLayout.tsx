import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { FileText, Edit3, Eye, CheckCircle, ClipboardCheck } from 'lucide-react'
import { type ResumeData, getResumeData, saveResumeData } from '../types/aiResume'

export function useResume() {
  const [resume, setResume] = useState<ResumeData>(getResumeData())

  const updateResume = (updates: Partial<ResumeData>) => {
    const updated = { ...resume, ...updates }
    setResume(updated)
    saveResumeData(updated)
  }

  const updatePersonalInfo = (info: Partial<ResumeData['personalInfo']>) => {
    updateResume({
      personalInfo: { ...resume.personalInfo, ...info }
    })
  }

  const updateLinks = (links: Partial<ResumeData['links']>) => {
    updateResume({
      links: { ...resume.links, ...links }
    })
  }

  return {
    resume,
    setResume,
    updateResume,
    updatePersonalInfo,
    updateLinks
  }
}

function AIResumeLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/ai-resume'

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/ai-resume" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#111111] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">AI Resume Builder</span>
          </NavLink>

          {/* Navigation */}
          {!isHome && (
            <nav className="flex items-center gap-1">
              <NavLink
                to="/ai-resume/builder"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Edit3 className="w-4 h-4" />
                Builder
              </NavLink>
              <NavLink
                to="/ai-resume/preview"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Eye className="w-4 h-4" />
                Preview
              </NavLink>
              <NavLink
                to="/ai-resume/test"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <ClipboardCheck className="w-4 h-4" />
                Test
              </NavLink>
              <NavLink
                to="/ai-resume/proof"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <CheckCircle className="w-4 h-4" />
                Proof
              </NavLink>
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">KodNest Premium</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default AIResumeLayout
