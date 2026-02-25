import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'
import { getHistory, deleteAnalysis, clearHistory } from '../utils/storage'
import type { AnalysisResult } from '../utils/skillExtractor'
import { 
  Clock, 
  Building2, 
  TrendingUp, 
  Trash2, 
  ExternalLink,
  History as HistoryIcon,
  AlertCircle
} from 'lucide-react'

function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteAnalysis(id)
    setHistory(getHistory())
  }

  const handleClearAll = () => {
    clearHistory()
    setHistory([])
    setShowConfirmClear(false)
  }

  const handleViewResult = (id: string) => {
    navigate(`/results?id=${id}`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis History</h2>
          <p className="text-gray-600">View your past job description analyses</p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Analyze job descriptions to build your history. All analyses are automatically saved here.
            </p>
            <button
              onClick={() => navigate('/analyzer')}
              className="bg-primary hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Analyze Your First JD
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis History</h2>
          <p className="text-gray-600">{history.length} {history.length === 1 ? 'analysis' : 'analyses'} saved</p>
        </div>
        <button
          onClick={() => setShowConfirmClear(true)}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Confirm Clear Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clear All History?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all {history.length} saved analyses. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {history.map((item) => (
          <Card
            key={item.id}
            onClick={() => handleViewResult(item.id)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {item.company || 'Unknown Company'}
                    </h3>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">{item.role || 'Unknown Role'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {Object.values(item.extractedSkills).flat().length} skills
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-lg ${getScoreColor(item.readinessScore)}`}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-bold">{item.readinessScore}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default History
