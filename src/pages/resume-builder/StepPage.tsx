import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { Lightbulb, Target, Layers, Code, Hammer, TestTube, Rocket } from 'lucide-react'

const stepContent: Record<string, {
  icon: React.ElementType
  title: string
  description: string
  objectives: string[]
  deliverables: string[]
}> = {
  '01-problem': {
    icon: Lightbulb,
    title: 'Problem Definition',
    description: 'Define the core problem your AI Resume Builder solves.',
    objectives: [
      'Identify pain points in current resume building process',
      'Define target user personas',
      'Articulate the value proposition'
    ],
    deliverables: [
      'Problem statement document',
      'User persona profiles',
      'Value proposition canvas'
    ]
  },
  '02-market': {
    icon: Target,
    title: 'Market Research',
    description: 'Analyze the competitive landscape and market opportunity.',
    objectives: [
      'Research existing resume builder solutions',
      'Identify market gaps and opportunities',
      'Define competitive advantages'
    ],
    deliverables: [
      'Competitive analysis matrix',
      'Market size estimation',
      'Differentiation strategy'
    ]
  },
  '03-architecture': {
    icon: Layers,
    title: 'System Architecture',
    description: 'Design the high-level system components and data flow.',
    objectives: [
      'Define system components',
      'Design data flow architecture',
      'Select technology stack'
    ],
    deliverables: [
      'System architecture diagram',
      'Technology stack documentation',
      'API design overview'
    ]
  },
  '04-hld': {
    icon: Code,
    title: 'High Level Design',
    description: 'Create detailed high-level design for core features.',
    objectives: [
      'Design user flows',
      'Define feature specifications',
      'Create wireframes'
    ],
    deliverables: [
      'User flow diagrams',
      'Feature specification document',
      'High-fidelity wireframes'
    ]
  },
  '05-lld': {
    icon: Hammer,
    title: 'Low Level Design',
    description: 'Define implementation details and component structure.',
    objectives: [
      'Design component hierarchy',
      'Define data models',
      'Plan API endpoints'
    ],
    deliverables: [
      'Component architecture',
      'Database schema',
      'API endpoint specifications'
    ]
  },
  '06-build': {
    icon: Code,
    title: 'Build Phase',
    description: 'Implement the core functionality and features.',
    objectives: [
      'Set up project structure',
      'Implement UI components',
      'Integrate AI features'
    ],
    deliverables: [
      'Functional prototype',
      'Component library',
      'Working AI integration'
    ]
  },
  '07-test': {
    icon: TestTube,
    title: 'Testing',
    description: 'Validate functionality and ensure quality.',
    objectives: [
      'Write unit tests',
      'Perform integration testing',
      'Conduct user acceptance testing'
    ],
    deliverables: [
      'Test suite with coverage report',
      'Bug fix documentation',
      'UAT feedback report'
    ]
  },
  '08-ship': {
    icon: Rocket,
    title: 'Ship',
    description: 'Deploy and launch the application.',
    objectives: [
      'Prepare deployment pipeline',
      'Configure production environment',
      'Launch and monitor'
    ],
    deliverables: [
      'Deployed application',
      'Monitoring dashboard',
      'Launch announcement'
    ]
  }
}

interface StepPageProps {
  stepId: string
}

function StepPage({ stepId }: StepPageProps) {
  const content = stepContent[stepId]
  const Icon = content?.icon || Lightbulb

  if (!content) {
    return <div>Step not found</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Objectives</h3>
            <ul className="space-y-2">
              {content.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Deliverables</h3>
            <ul className="space-y-2">
              {content.deliverables.map((del, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  {del}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-gray-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
              Copy the prompt from the build panel on the right
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
              Open Lovable and paste the prompt
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
              Build the section and take a screenshot
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
              Mark status and upload screenshot
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">5</span>
              Click Next to proceed to the next step
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

export default StepPage
