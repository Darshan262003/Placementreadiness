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

        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
