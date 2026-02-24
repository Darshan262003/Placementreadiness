import { Play, Clock, CheckCircle } from 'lucide-react'

function Assessments() {
  const assessments = [
    {
      id: 1,
      title: 'Data Structures Fundamentals',
      description: 'Test your knowledge of arrays, linked lists, stacks, and queues.',
      duration: '45 mins',
      questions: 30,
      status: 'available'
    },
    {
      id: 2,
      title: 'Algorithms Mastery',
      description: 'Comprehensive assessment on sorting, searching, and dynamic programming.',
      duration: '60 mins',
      questions: 40,
      status: 'available'
    },
    {
      id: 3,
      title: 'System Design Basics',
      description: 'Evaluate your understanding of scalable system architecture.',
      duration: '90 mins',
      questions: 25,
      status: 'completed'
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
              {assessment.status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{assessment.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{assessment.questions} questions</span>
              </div>
            </div>

            {assessment.status === 'available' ? (
              <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                <Play className="w-4 h-4" />
                Start Assessment
              </button>
            ) : (
              <button className="w-full bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-lg cursor-default">
                Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Assessments
