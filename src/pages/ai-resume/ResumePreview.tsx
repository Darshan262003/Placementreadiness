import { type ResumeData, type ResumeTemplate } from '../../types/aiResume'
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react'

interface ResumePreviewProps {
  resume: ResumeData
  template?: ResumeTemplate
}

const TEMPLATE_STYLES: Record<ResumeTemplate, {
  container: string
  header: string
  name: string
  sectionTitle: string
  sectionBorder: string
}> = {
  classic: {
    container: 'text-gray-900 font-serif text-sm',
    header: 'text-center border-b-2 border-gray-900 pb-4 mb-4',
    name: 'text-2xl font-bold text-gray-900 mb-2',
    sectionTitle: 'text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2',
    sectionBorder: 'border-b border-gray-300'
  },
  modern: {
    container: 'text-gray-900 font-sans text-sm',
    header: 'border-l-4 border-gray-900 pl-4 mb-4',
    name: 'text-3xl font-light text-gray-900 mb-2',
    sectionTitle: 'text-xs font-semibold uppercase tracking-widest text-gray-500 pb-1 mb-2',
    sectionBorder: 'border-b border-gray-200'
  },
  minimal: {
    container: 'text-gray-900 font-sans text-sm',
    header: 'mb-4',
    name: 'text-xl font-medium text-gray-900 mb-1',
    sectionTitle: 'text-sm font-medium text-gray-700 pb-1 mb-2',
    sectionBorder: 'border-b border-gray-100'
  }
}

function ResumePreview({ resume, template = 'classic' }: ResumePreviewProps) {
  const { personalInfo, summary, education, experience, projects, skills, links } = resume

  // Check if sections have content
  const hasPersonalInfo = personalInfo.name || personalInfo.email || personalInfo.phone || personalInfo.location
  const hasSummary = summary.trim().length > 0
  const hasEducation = education.length > 0 && education.some(ed => ed.school.trim())
  const hasExperience = experience.length > 0 && experience.some(exp => exp.company.trim() || exp.title.trim())
  const hasProjects = projects.length > 0 && projects.some(proj => proj.name.trim())
  const hasSkills = skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0
  const hasLinks = links.github.trim() || links.linkedin.trim()

  const styles = TEMPLATE_STYLES[template]

  return (
    <div className={styles.container}>
      {/* Header - Always show if any personal info exists */}
      {hasPersonalInfo && (
      <div className={styles.header}>
        <h1 className={styles.name}>
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
          <h2 className={styles.sectionTitle}>
            Summary
          </h2>
          <p className="text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {hasExperience && (
        <div className="mb-4 print:break-inside-avoid">
          <h2 className={styles.sectionTitle}>
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
      {hasEducation && (
        <div className="mb-4 print:break-inside-avoid">
          <h2 className={styles.sectionTitle}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((ed) => (
              <div key={ed.id} className="flex justify-between items-start print:break-inside-avoid">
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
      {hasProjects && (
        <div className="mb-4 print:break-inside-avoid">
          <h2 className={styles.sectionTitle}>
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="print:break-inside-avoid">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm">{proj.name || 'Project Name'}</h3>
                  <div className="flex items-center gap-2">
                    {proj.liveUrl && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </span>
                    )}
                    {proj.githubUrl && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        Code
                      </span>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-xs mt-1 leading-relaxed">{proj.description}</p>
                )}
                {proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tech}
                      </span>
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
          <h2 className={styles.sectionTitle}>
            Skills
          </h2>
          <div className="space-y-2">
            {skills.technical.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-600">Technical: </span>
                <span className="text-xs">{skills.technical.join(' • ')}</span>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-600">Soft Skills: </span>
                <span className="text-xs">{skills.soft.join(' • ')}</span>
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-600">Tools: </span>
                <span className="text-xs">{skills.tools.join(' • ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Links Section */}
      {hasLinks && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h2 className={styles.sectionTitle}>
            Links
          </h2>
          <div className="flex flex-wrap gap-4 text-xs">
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

      {/* Empty State */}
      {!hasPersonalInfo && !hasSummary && !hasExperience && !hasEducation && !hasProjects && !hasSkills && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Your resume preview will appear here</p>
          <p className="text-xs mt-1">Start filling in your details</p>
        </div>
      )}
    </div>
  )
}

export default ResumePreview
