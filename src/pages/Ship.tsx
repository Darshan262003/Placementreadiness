import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { 
  getTestChecklist, 
  isChecklistComplete,
  type TestChecklist
} from '../types/testChecklist'
import { 
  Rocket, 
  Lock, 
  CheckCircle,
  ArrowLeft,
  ClipboardList,
  Github,
  Globe
} from 'lucide-react'

function Ship() {
  const navigate = useNavigate()
  const [checklist, setChecklist] = useState<TestChecklist | null>(null)

  useEffect(() => {
    setChecklist(getTestChecklist())
  }, [])

  if (!checklist) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const isComplete = isChecklistComplete(checklist)
  const passedCount = checklist.items.filter(i => i.checked).length
  const totalCount = checklist.items.length

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ship</h2>
        <p className="text-gray-600">Deploy your Placement Readiness Platform</p>
      </div>

      {!isComplete ? (
        /* Locked State */
        <Card className="border-red-300">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Shipping Locked
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Complete all tests in the checklist before shipping. 
              Currently {passedCount} of {totalCount} tests passed.
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6 max-w-sm mx-auto">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(passedCount / totalCount) * 100}%` }}
              />
            </div>

            <button
              onClick={() => navigate('/test')}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ClipboardList className="w-5 h-5" />
              Go to Test Checklist
            </button>
          </CardContent>
        </Card>
      ) : (
        /* Unlocked State */
        <>
          <Card className="border-green-400 mb-6">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                All Tests Passed!
              </h3>
              <p className="text-gray-600 mb-6">
                Your Placement Readiness Platform is ready to ship.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{totalCount} / {totalCount} tests passed</span>
              </div>
            </CardContent>
          </Card>

          {/* Ship Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Github className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Push to GitHub</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Commit and push your changes to the remote repository.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      git push origin main
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Deploy to Production</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Deploy your built application to your hosting platform.
                    </p>
                    <span className="text-xs text-gray-500">
                      dist/ folder ready for deployment
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pre-ship Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pre-ship Summary</CardTitle>
              <CardDescription>Review what's included in this release</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  JD Analyzer with skill extraction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Company Intel & Round Mapping
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Interactive skill assessment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Live score updates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Export tools (copy & download)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  History persistence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Input validation & edge case handling
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Final Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate('/test')}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Review Checklist
            </button>
            <button
              onClick={() => alert('Ready to ship! Use git push or your deployment method.')}
              className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Ship It!
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Ship
