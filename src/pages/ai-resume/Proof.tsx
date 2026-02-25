import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, FileText, Image, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'

interface Artifact {
  id: string
  type: 'resume' | 'screenshot' | 'export'
  name: string
  uploadedAt: string
}

function Proof() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])

  // Load artifacts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ai_resume_artifacts')
    if (stored) {
      setArtifacts(JSON.parse(stored))
    }
  }, [])

  const completionSteps = [
    { id: 'home', label: 'Home page visited', completed: true },
    { id: 'builder', label: 'Builder page accessed', completed: true },
    { id: 'preview', label: 'Preview page viewed', completed: true },
    { id: 'proof', label: 'Proof page reached', completed: true },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Proof of Completion</h1>
        <p className="text-gray-600">AI Resume Builder — Skeleton Implementation</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Completion Status */}
        <Card>
          <CardHeader>
            <CardTitle>Build Progress</CardTitle>
            <CardDescription>Implementation milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completionSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                  <span className={step.completed ? 'text-gray-900' : 'text-gray-400'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="font-bold text-green-600">4/4</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-500 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Implemented */}
        <Card>
          <CardHeader>
            <CardTitle>Features Implemented</CardTitle>
            <CardDescription>Skeleton structure complete</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Home page with CTA
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Builder with form sections
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Live preview panel
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Preview page (B&W layout)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Sample data loader
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                localStorage persistence
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Circle className="w-4 h-4" />
                ATS scoring (not implemented)
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Circle className="w-4 h-4" />
                Export functionality (not implemented)
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Artifacts Placeholder */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Build Artifacts</CardTitle>
            <CardDescription>Screenshots and exports will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {artifacts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No artifacts uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Screenshots and exports will be stored here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {artifacts.map((artifact) => (
                  <div key={artifact.id} className="p-4 border border-gray-200 rounded-lg">
                    {artifact.type === 'resume' && <FileText className="w-8 h-8 text-gray-400 mb-2" />}
                    {artifact.type === 'screenshot' && <Image className="w-8 h-8 text-gray-400 mb-2" />}
                    {artifact.type === 'export' && <Download className="w-8 h-8 text-gray-400 mb-2" />}
                    <p className="text-sm font-medium">{artifact.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(artifact.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Framework</p>
                <p className="text-gray-600">React 18 + TypeScript</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Styling</p>
                <p className="text-gray-600">Tailwind CSS</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Routing</p>
                <p className="text-gray-600">React Router v6</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Storage</p>
                <p className="text-gray-600">localStorage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Proof
