import { useState, useEffect } from 'react'
import { Check, X, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

interface TestItem {
  id: string
  label: string
  checked: boolean
}

const TEST_CHECKLIST_KEY = 'aiResumeTestChecklist'

const DEFAULT_TESTS: TestItem[] = [
  { id: '1', label: 'All form sections save to localStorage', checked: false },
  { id: '2', label: 'Live preview updates in real-time', checked: false },
  { id: '3', label: 'Template switching preserves data', checked: false },
  { id: '4', label: 'Color theme persists after refresh', checked: false },
  { id: '5', label: 'ATS score calculates correctly', checked: false },
  { id: '6', label: 'Score updates live on edit', checked: false },
  { id: '7', label: 'Export buttons work (copy/download)', checked: false },
  { id: '8', label: 'Empty states handled gracefully', checked: false },
  { id: '9', label: 'Mobile responsive layout works', checked: false },
  { id: '10', label: 'No console errors on any page', checked: false }
]

function TestChecklist() {
  const [tests, setTests] = useState<TestItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(TEST_CHECKLIST_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return DEFAULT_TESTS
        }
      }
    }
    return DEFAULT_TESTS
  })

  // Save to localStorage whenever tests change
  useEffect(() => {
    localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(tests))
  }, [tests])

  const toggleTest = (id: string) => {
    setTests(tests.map(test => 
      test.id === id ? { ...test, checked: !test.checked } : test
    ))
  }

  const resetChecklist = () => {
    setTests(DEFAULT_TESTS)
    localStorage.removeItem(TEST_CHECKLIST_KEY)
  }

  const passedCount = tests.filter(t => t.checked).length
  const allPassed = passedCount === tests.length
  const progress = (passedCount / tests.length) * 100

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Checklist</h1>
        <p className="text-gray-600">Verify all AI Resume Builder features work correctly</p>
      </div>

      {/* Progress Summary */}
      <Card className={`mb-6 ${allPassed ? 'border-green-200 bg-green-50' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {allPassed ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {passedCount} of {tests.length} tests passed
                </p>
                <p className="text-sm text-gray-500">
                  {allPassed 
                    ? 'All features working correctly!' 
                    : 'Complete all tests before shipping'}
                </p>
              </div>
            </div>
            <button
              onClick={resetChecklist}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                allPassed ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tests.map((test, index) => (
              <button
                key={test.id}
                onClick={() => toggleTest(test.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                  test.checked 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  test.checked ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {test.checked ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-gray-400 w-6">{index + 1}.</span>
                  <span className={`text-sm ${test.checked ? 'text-green-800' : 'text-gray-700'}`}>
                    {test.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Testing Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Fill out all form sections and refresh the page to verify persistence</li>
          <li>Switch between Classic, Modern, and Minimal templates</li>
          <li>Change color themes and verify they persist</li>
          <li>Check ATS score updates as you add content</li>
          <li>Test export buttons (Copy as Text, Download PDF)</li>
          <li>Resize browser window to test mobile responsiveness</li>
          <li>Open browser console to check for errors</li>
        </ul>
      </div>
    </div>
  )
}

export default TestChecklist
