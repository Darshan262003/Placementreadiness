import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import LandingPage from './pages/LandingPage'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'
import Assessments from './pages/Assessments'
import Resources from './pages/Resources'
import Profile from './pages/Profile'
import Analyzer from './pages/Analyzer'
import Results from './pages/Results'
import History from './pages/History'
import TestChecklistPage from './pages/TestChecklist'
import Ship from './pages/Ship'

// Resume Builder imports
import ResumeBuilderLayout from './components/ResumeBuilderLayout'
import Problem from './pages/resume-builder/Problem'
import Market from './pages/resume-builder/Market'
import Architecture from './pages/resume-builder/Architecture'
import HLD from './pages/resume-builder/HLD'
import LLD from './pages/resume-builder/LLD'
import Build from './pages/resume-builder/Build'
import Test from './pages/resume-builder/Test'
import ShipStep from './pages/resume-builder/Ship'
import Proof from './pages/resume-builder/Proof'

// AI Resume imports
import AIResumeLayout from './components/AIResumeLayout'
import AIResumeHome from './pages/ai-resume/Home'
import AIResumeBuilder from './pages/ai-resume/Builder'
import AIResumePreview from './pages/ai-resume/Preview'
import AIResumeProof from './pages/ai-resume/Proof'
import AIResumeTestChecklist from './pages/ai-resume/TestChecklist'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analyzer" element={<Analyzer />} />
          <Route path="results" element={<Results />} />
          <Route path="history" element={<History />} />
          <Route path="test" element={<TestChecklistPage />} />
          <Route path="ship" element={<Ship />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Resume Builder Routes */}
        <Route path="/rb" element={<ResumeBuilderLayout />}>
          <Route path="01-problem" element={<Problem />} />
          <Route path="02-market" element={<Market />} />
          <Route path="03-architecture" element={<Architecture />} />
          <Route path="04-hld" element={<HLD />} />
          <Route path="05-lld" element={<LLD />} />
          <Route path="06-build" element={<Build />} />
          <Route path="07-test" element={<Test />} />
          <Route path="08-ship" element={<ShipStep />} />
          <Route path="proof" element={<Proof />} />
        </Route>

        {/* AI Resume Routes */}
        <Route path="/ai-resume" element={<AIResumeLayout />}>
          <Route index element={<AIResumeHome />} />
          <Route path="builder" element={<AIResumeBuilder />} />
          <Route path="preview" element={<AIResumePreview />} />
          <Route path="test" element={<AIResumeTestChecklist />} />
          <Route path="proof" element={<AIResumeProof />} />
        </Route>

        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
