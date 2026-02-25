import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'
import { 
  getTestChecklist, 
  saveTestChecklist, 
  resetTestChecklist,
  getPassedCount,
  isChecklistComplete,
  type TestChecklist,
} from '../types/testChecklist'
import { 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  ClipboardList
} from 'lucide-react'

function TestChecklistPage() {
  const navigate = useNavigate()
  const [checklist, setChecklist] = useState<TestChecklist | null>(null)
  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set())

  useEffect(() => {
    setChecklist(getTestChecklist())
  }, [])

  const toggleItem = (itemId: string) => {
    if (!checklist) return
    
    const updatedItems = checklist.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    )
    
    const updatedChecklist = {
      ...checklist,
      items: updatedItems,
      lastUpdated: new Date().toISOString()
    }
    
    setChecklist(updatedChecklist)
    saveTestChecklist(updatedChecklist)
  }

  const toggleHint = (itemId: string) => {
    setExpandedHints(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleReset = () => {
    if (window.confirm('Reset all test checklist items to unchecked?')) {
      resetTestChecklist()
      setChecklist(getTestChecklist())
    }
  }

  const handleProceedToShip = () => {
    if (isChecklistComplete(checklist!)) {
      navigate('/ship')
    }
  }

  if (!checklist) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600">Loading test checklist...</p>
      </div>
    )
  }

  const passedCount = getPassedCount(checklist)
  const totalCount = checklist.items.length
  const isComplete = isChecklistComplete(checklist)
  const progressPercentage = (passedCount / totalCount) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Checklist</h2>
        <p className="text-gray-600">Verify all functionality before shipping</p>
      </div>

      {/* Summary Card */}
      <Card className={`mb-6 ${isComplete ? 'border-green-400' : 'border-orange-300'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isComplete ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                {isComplete ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tests Passed: {passedCount} / {totalCount}
                </h3>
                <p className="text-sm text-gray-500">
                  {isComplete 
                    ? 'All tests passed! Ready to ship.' 
                    : 'Fix issues before shipping.'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold ${
                isComplete ? 'text-green-600' : 'text-orange-600'
              }`}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isComplete ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset checklist
            </button>
            
            <button
              onClick={handleProceedToShip}
              disabled={!isComplete}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                isComplete
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Proceed to Ship
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Test Items */}
      <div className="space-y-3">
        {checklist.items.map((item, index) => (
          <Card 
            key={item.id}
            className={`transition-all ${item.checked ? 'border-green-300 bg-green-50/30' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    item.checked 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-medium ${
                      item.checked ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                  </div>

                  {/* Hint Toggle */}
                  <button
                    onClick={() => toggleHint(item.id)}
                    className="mt-2 flex items-center gap-1 text-sm text-primary hover:text-primary-600 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {expandedHints.has(item.id) ? 'Hide hint' : 'How to test'}
                  </button>

                  {/* Hint Content */}
                  {expandedHints.has(item.id) && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      {item.hint}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Reset all progress
        </button>
        
        <p className="text-xs text-gray-400">
          Last updated: {new Date(checklist.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default TestChecklistPage
