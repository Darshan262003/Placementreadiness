import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, Zap } from 'lucide-react'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Builder</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-[#111111] mb-6 leading-tight">
            Build a Resume That
            <br />
            Gets Read.
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            Create a professional, ATS-friendly resume in minutes. 
            Clean design. No clutter. Just results.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate('/ai-resume/builder')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#111111] hover:bg-gray-800 text-white rounded-lg text-lg font-medium transition-colors"
          >
            Start Building
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              ATS-Optimized
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Instant Preview
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <span>© 2024 AI Resume Builder</span>
          <span>KodNest Premium Build System</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
