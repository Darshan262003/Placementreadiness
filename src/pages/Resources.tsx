import { FileText, Video, BookOpen, ExternalLink } from 'lucide-react'

function Resources() {
  const resources = [
    {
      id: 1,
      title: 'Cracking the Coding Interview',
      type: 'Book',
      description: 'Essential guide for technical interview preparation.',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      title: 'Data Structures Video Course',
      type: 'Video',
      description: 'Comprehensive video tutorials on fundamental data structures.',
      icon: Video,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 3,
      title: 'System Design Primer',
      type: 'Article',
      description: 'Learn how to design large-scale systems.',
      icon: FileText,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 4,
      title: 'Behavioral Interview Guide',
      type: 'Article',
      description: 'STAR method and common behavioral questions.',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600'
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${resource.color}`}>
                <resource.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {resource.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                <button className="flex items-center gap-1 text-primary hover:text-primary-600 text-sm font-medium transition-colors duration-200">
                  View Resource
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Resources
