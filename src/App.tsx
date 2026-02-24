import { useState } from 'react'
import './App.css'

function App() {
  const [currentStep] = useState(1)
  const totalSteps = 5
  const [status, setStatus] = useState<'not-started' | 'in-progress' | 'shipped'>('not-started')
  const [checklist, setChecklist] = useState({
    uiBuilt: false,
    logicWorking: false,
    testPassed: false,
    deployed: false
  })

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'not-started':
        return <span className="badge badge-not-started">Not Started</span>
      case 'in-progress':
        return <span className="badge badge-in-progress">In Progress</span>
      case 'shipped':
        return <span className="badge badge-shipped">Shipped</span>
    }
  }

  return (
    <div className="app">
      {/* Top Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '18px' }}>
            KodNest Premium
          </span>
        </div>
        <div className="top-bar-center">
          <div className="progress-indicator">
            <span>Step {currentStep} / {totalSteps}</span>
            <div className="progress-steps">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`progress-step ${i + 1 === currentStep ? 'active' : ''} ${i + 1 < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="top-bar-right">
          {getStatusBadge()}
        </div>
      </header>

      {/* Context Header */}
      <section className="context-header">
        <div className="container">
          <h1>Design System Foundation</h1>
          <p>Establish the visual language, component library, and interaction patterns for the KodNest Premium platform.</p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Primary Workspace */}
        <main className="primary-workspace">
          <div className="card" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Component Showcase</h3>
            <p className="text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
              Preview of the design system components and their states.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Buttons */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Buttons
                </h4>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary">Primary Button</button>
                  <button className="btn btn-secondary">Secondary Button</button>
                  <button className="btn btn-primary btn-sm">Small</button>
                  <button className="btn btn-secondary btn-sm">Small Alt</button>
                </div>
              </div>

              {/* Inputs */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Inputs
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '400px' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter your text here..."
                  />
                  <textarea
                    className="input textarea"
                    placeholder="Enter longer text..."
                  />
                </div>
              </div>

              {/* Cards */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Cards
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
                  <div className="card">
                    <h5 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>Standard Card</h5>
                    <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', margin: 0 }}>With subtle border and clean padding.</p>
                  </div>
                  <div className="card card-subtle">
                    <h5 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>Subtle Card</h5>
                    <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', margin: 0 }}>With lighter border treatment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Controls */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Status Controls</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setStatus('not-started')}>
                Set: Not Started
              </button>
              <button className="btn btn-secondary" onClick={() => setStatus('in-progress')}>
                Set: In Progress
              </button>
              <button className="btn btn-secondary" onClick={() => setStatus('shipped')}>
                Set: Shipped
              </button>
            </div>
          </div>
        </main>

        {/* Secondary Panel */}
        <aside className="secondary-panel">
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Step 1: Foundation</h3>
            <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', lineHeight: '1.7' }}>
              Define the core design tokens including colors, typography, spacing, and component primitives.
            </p>
          </div>

          <div style={{ marginBottom: 'var(--space-3)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Prompt
            </h4>
            <div className="prompt-box">
              Create a comprehensive design system with calm, intentional aesthetics. Use off-white backgrounds (#F7F6F3), deep red accents (#8B0000), and serif headings with clean sans-serif body text.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <button className="btn btn-primary">Copy Prompt</button>
            <button className="btn btn-secondary">Build in Lovable</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1)' }}>
              <button className="btn btn-secondary btn-sm">It Worked</button>
              <button className="btn btn-secondary btn-sm">Error</button>
            </div>
            <button className="btn btn-secondary btn-sm">Add Screenshot</button>
          </div>
        </aside>
      </div>

      {/* Proof Footer */}
      <footer className="proof-footer">
        <div className="container">
          <ul className="checklist">
            <li className="checklist-item">
              <button
                className={`checklist-checkbox ${checklist.uiBuilt ? 'checked' : ''}`}
                onClick={() => toggleChecklist('uiBuilt')}
                aria-label="Toggle UI Built"
              />
              <span>UI Built</span>
            </li>
            <li className="checklist-item">
              <button
                className={`checklist-checkbox ${checklist.logicWorking ? 'checked' : ''}`}
                onClick={() => toggleChecklist('logicWorking')}
                aria-label="Toggle Logic Working"
              />
              <span>Logic Working</span>
            </li>
            <li className="checklist-item">
              <button
                className={`checklist-checkbox ${checklist.testPassed ? 'checked' : ''}`}
                onClick={() => toggleChecklist('testPassed')}
                aria-label="Toggle Test Passed"
              />
              <span>Test Passed</span>
            </li>
            <li className="checklist-item">
              <button
                className={`checklist-checkbox ${checklist.deployed ? 'checked' : ''}`}
                onClick={() => toggleChecklist('deployed')}
                aria-label="Toggle Deployed"
              />
              <span>Deployed</span>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

export default App
