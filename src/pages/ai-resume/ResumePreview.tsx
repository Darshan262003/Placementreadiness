import { type ResumeData } from '../../types/aiResume'
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'

interface ResumePreviewProps {
  resume: ResumeData
}

function ResumePreview({ resume }: ResumePreviewProps) {
  const { personalInfo, summary, education, experience, projects, skills, links } = resume

  return (
    <div className="text-gray-900 font-sans text-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {personalInfo.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {links.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3" />
              {links.github}
            </span>
          )}
          {links.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {links.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Summary
          </h2>
          <p className="text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{exp.title || 'Job Title'}</h3>
                    <p className="text-xs text-gray-600">{exp.company || 'Company'}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((ed) => (
              <div key={ed.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">{ed.school || 'School'}</h3>
                  <p className="text-xs text-gray-600">
                    {ed.degree} {ed.field && `in ${ed.field}`}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {ed.startDate} - {ed.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm">{proj.name || 'Project Name'}</h3>
                  {proj.link && (
                    <span className="text-xs text-gray-500">{proj.link}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs mt-1 leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <p className="text-xs">{skills.join(' • ')}</p>
        </div>
      )}

      {/* Empty State */}
      {!personalInfo.name && !summary && experience.length === 0 && education.length === 0 && projects.length === 0 && skills.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Your resume preview will appear here</p>
          <p className="text-xs mt-1">Start filling in your details</p>
        </div>
      )}
    </div>
  )
}

export default ResumePreview
