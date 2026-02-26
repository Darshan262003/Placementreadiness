import { type ResumeData, type ResumeTemplate, type ResumeColor, COLOR_THEMES } from '../../types/aiResume'
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react'

interface ResumePreviewProps {
  resume: ResumeData
  template?: ResumeTemplate
  color?: ResumeColor
}

function ResumePreview({ resume, template = 'classic', color = 'teal' }: ResumePreviewProps) {
  const accentColor = COLOR_THEMES[color]
  
  switch (template) {
    case 'modern':
      return <ModernTemplate resume={resume} accentColor={accentColor} />
    case 'minimal':
      return <MinimalTemplate resume={resume} accentColor={accentColor} />
    default:
      return <ClassicTemplate resume={resume} accentColor={accentColor} />
  }
}

// Classic Template
function ClassicTemplate({ resume, accentColor }: { resume: ResumeData; accentColor: string }) {
  const { personalInfo, summary, education, experience, projects, skills, links } = resume

  const hasPersonalInfo = personalInfo.name || personalInfo.email || personalInfo.phone || personalInfo.location
  const hasSummary = summary.trim().length > 0
  const hasEducation = education.length > 0 && education.some(ed => ed.school.trim())
  const hasExperience = experience.length > 0 && experience.some(exp => exp.company.trim() || exp.title.trim())
  const hasProjects = projects.length > 0 && projects.some(proj => proj.name.trim())
  const hasSkills = skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0
  const hasLinks = links.github.trim() || links.linkedin.trim()

  return (
    <div className="text-gray-900 font-serif text-sm">
      {/* Header */}
      {hasPersonalInfo && (
        <div className="text-center border-b-2 pb-4 mb-4" style={{ borderColor: accentColor }}>
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
      )}

      {/* Summary */}
      {hasSummary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderColor: accentColor + '40' }}>
            Summary
          </h2>
          <p className="text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {hasExperience && (
        <div className="mb-4 print:break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderColor: accentColor + '40' }}>
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="print:break-inside-avoid">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{exp.title || 'Job Title'}</h3>
                    <p className="text-xs text-gray-600">{exp.company || 'Company'}</p>
                  </div>
                  <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                {exp.description && <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {hasEducation && (
        <div className="mb-4 print:break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderColor: accentColor + '40' }}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((ed) => (
              <div key={ed.id} className="flex justify-between items-start print:break-inside-avoid">
                <div>
                  <h3 className="font-semibold text-sm">{ed.school || 'School'}</h3>
                  <p className="text-xs text-gray-600">{ed.degree} {ed.field && `in ${ed.field}`}</p>
                </div>
                <span className="text-xs text-gray-500">{ed.startDate} - {ed.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {hasProjects && (
        <div className="mb-4 print:break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderColor: accentColor + '40' }}>
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="print:break-inside-avoid">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm">{proj.name || 'Project Name'}</h3>
                  <div className="flex items-center gap-2">
                    {proj.liveUrl && <span className="text-xs text-gray-500 flex items-center gap-1"><ExternalLink className="w-3 h-3" />Live</span>}
                    {proj.githubUrl && <span className="text-xs text-gray-500 flex items-center gap-1"><Github className="w-3 h-3" />Code</span>}
                  </div>
                </div>
                {proj.description && <p className="text-xs mt-1 leading-relaxed">{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderColor: accentColor + '40' }}>
            Skills
          </h2>
          <div className="space-y-2">
            {skills.technical.length > 0 && <div><span className="text-xs font-medium text-gray-600">Technical: </span><span className="text-xs">{skills.technical.join(' • ')}</span></div>}
            {skills.soft.length > 0 && <div><span className="text-xs font-medium text-gray-600">Soft Skills: </span><span className="text-xs">{skills.soft.join(' • ')}</span></div>}
            {skills.tools.length > 0 && <div><span className="text-xs font-medium text-gray-600">Tools: </span><span className="text-xs">{skills.tools.join(' • ')}</span></div>}
          </div>
        </div>
      )}

      {/* Links */}
      {hasLinks && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ borderColor: accentColor + '40' }}>
            Links
          </h2>
          <div className="flex flex-wrap gap-4 text-xs">
            {links.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{links.github}</span>}
            {links.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{links.linkedin}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

// Modern Template - Two Column with Sidebar
function ModernTemplate({ resume, accentColor }: { resume: ResumeData; accentColor: string }) {
  const { personalInfo, summary, education, experience, projects, skills, links } = resume

  const hasSummary = summary.trim().length > 0
  const hasEducation = education.length > 0 && education.some(ed => ed.school.trim())
  const hasExperience = experience.length > 0 && experience.some(exp => exp.company.trim() || exp.title.trim())
  const hasProjects = projects.length > 0 && projects.some(proj => proj.name.trim())
  const hasSkills = skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0

  return (
    <div className="text-gray-900 font-sans text-sm flex min-h-[600px]">
      {/* Left Sidebar */}
      <div className="w-1/3 p-4 text-white" style={{ backgroundColor: accentColor }}>
        {/* Name */}
        {personalInfo.name && (
          <h1 className="text-xl font-bold mb-4 leading-tight">{personalInfo.name}</h1>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-6 text-xs">
          {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" />{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" />{personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3" />{personalInfo.location}</div>}
        </div>

        {/* Links */}
        {(links.github || links.linkedin) && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Links</h3>
            <div className="space-y-1 text-xs">
              {links.github && <div className="flex items-center gap-2"><Github className="w-3 h-3" />{links.github}</div>}
              {links.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-3 h-3" />{links.linkedin}</div>}
            </div>
          </div>
        )}

        {/* Skills in Sidebar */}
        {hasSkills && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Skills</h3>
            <div className="space-y-2 text-xs">
              {skills.technical.length > 0 && (
                <div>
                  <span className="opacity-70 block mb-1">Technical</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map(s => <span key={s} className="px-2 py-0.5 bg-white/20 rounded text-[10px]">{s}</span>)}
                  </div>
                </div>
              )}
              {skills.tools.length > 0 && (
                <div>
                  <span className="opacity-70 block mb-1">Tools</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.tools.map(s => <span key={s} className="px-2 py-0.5 bg-white/20 rounded text-[10px]">{s}</span>)}
                  </div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <span className="opacity-70 block mb-1">Soft Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.soft.map(s => <span key={s} className="px-2 py-0.5 bg-white/20 rounded text-[10px]">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-4 bg-white">
        {/* Summary */}
        {hasSummary && (
          <div className="mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Profile</h2>
            <p className="text-xs leading-relaxed text-gray-700">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {hasExperience && (
          <div className="mb-4 print:break-inside-avoid">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Experience</h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="print:break-inside-avoid">
                  <h3 className="font-semibold text-sm text-gray-900">{exp.title || 'Job Title'}</h3>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{exp.company || 'Company'}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.description && <p className="text-xs text-gray-700 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {hasEducation && (
          <div className="mb-4 print:break-inside-avoid">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Education</h2>
            <div className="space-y-2">
              {education.map((ed) => (
                <div key={ed.id} className="print:break-inside-avoid">
                  <h3 className="font-semibold text-sm text-gray-900">{ed.school || 'School'}</h3>
                  <p className="text-xs text-gray-600">{ed.degree} {ed.field && `in ${ed.field}`}</p>
                  <p className="text-xs text-gray-500">{ed.startDate} - {ed.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {hasProjects && (
          <div className="print:break-inside-avoid">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="print:break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-900">{proj.name || 'Project Name'}</h3>
                    <div className="flex items-center gap-2">
                      {proj.liveUrl && <ExternalLink className="w-3 h-3 text-gray-400" />}
                      {proj.githubUrl && <Github className="w-3 h-3 text-gray-400" />}
                    </div>
                  </div>
                  {proj.description && <p className="text-xs text-gray-700 leading-relaxed mt-1">{proj.description}</p>}
                  {proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Minimal Template - Clean, No Borders
function MinimalTemplate({ resume, accentColor }: { resume: ResumeData; accentColor: string }) {
  const { personalInfo, summary, education, experience, projects, skills, links } = resume

  const hasSummary = summary.trim().length > 0
  const hasEducation = education.length > 0 && education.some(ed => ed.school.trim())
  const hasExperience = experience.length > 0 && experience.some(exp => exp.company.trim() || exp.title.trim())
  const hasProjects = projects.length > 0 && projects.some(proj => proj.name.trim())
  const hasSkills = skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0

  return (
    <div className="text-gray-900 font-sans text-sm p-6">
      {/* Header */}
      {(personalInfo.name || personalInfo.email || personalInfo.phone || personalInfo.location) && (
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {links.github && <span>{links.github}</span>}
            {links.linkedin && <span>{links.linkedin}</span>}
          </div>
        </div>
      )}

      {/* Summary */}
      {hasSummary && (
        <div className="mb-8">
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {hasExperience && (
        <div className="mb-8 print:break-inside-avoid">
          <h2 className="text-sm font-medium mb-4" style={{ color: accentColor }}>Experience</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="print:break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{exp.title || 'Job Title'}</h3>
                  <span className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{exp.company || 'Company'}</p>
                {exp.description && <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {hasEducation && (
        <div className="mb-8 print:break-inside-avoid">
          <h2 className="text-sm font-medium mb-4" style={{ color: accentColor }}>Education</h2>
          <div className="space-y-4">
            {education.map((ed) => (
              <div key={ed.id} className="flex justify-between items-baseline print:break-inside-avoid">
                <div>
                  <h3 className="font-medium text-gray-900">{ed.school || 'School'}</h3>
                  <p className="text-xs text-gray-500">{ed.degree} {ed.field && `in ${ed.field}`}</p>
                </div>
                <span className="text-xs text-gray-400">{ed.startDate} - {ed.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {hasProjects && (
        <div className="mb-8 print:break-inside-avoid">
          <h2 className="text-sm font-medium mb-4" style={{ color: accentColor }}>Projects</h2>
          <div className="space-y-5">
            {projects.map((proj) => (
              <div key={proj.id} className="print:break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{proj.name || 'Project Name'}</h3>
                  <div className="flex items-center gap-3">
                    {proj.liveUrl && <span className="text-xs text-gray-400">Live</span>}
                    {proj.githubUrl && <span className="text-xs text-gray-400">Code</span>}
                  </div>
                </div>
                {proj.description && <p className="text-sm text-gray-700 leading-relaxed mb-2">{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <p className="text-xs text-gray-500">{proj.techStack.join(' • ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: accentColor }}>Skills</h2>
          <div className="space-y-2 text-sm">
            {skills.technical.length > 0 && <p className="text-gray-700"><span className="text-gray-400">Technical: </span>{skills.technical.join(', ')}</p>}
            {skills.soft.length > 0 && <p className="text-gray-700"><span className="text-gray-400">Soft: </span>{skills.soft.join(', ')}</p>}
            {skills.tools.length > 0 && <p className="text-gray-700"><span className="text-gray-400">Tools: </span>{skills.tools.join(', ')}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumePreview
