import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Clock, Calendar } from 'lucide-react'

// Circular Progress Component
function CircularProgress({ value, max = 100, size = 180, strokeWidth = 12 }: { value: number; max?: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = (value / max) * circumference
  const offset = circumference - progress

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(245, 58%, 51%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">/ {max}</span>
      </div>
    </div>
  )
}

// Progress Bar Component
function ProgressBar({ current, total, color = "bg-primary" }: { current: number; total: number; color?: string }) {
  const percentage = (current / total) * 100
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

// Day Circle Component
function DayCircle({ day, active }: { day: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
          active
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        {day.charAt(0)}
      </div>
      <span className="text-xs text-gray-500">{day}</span>
    </div>
  )
}

function Dashboard() {
  // Radar chart data
  const skillData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
  ]

  // Weekly activity data
  const weekDays = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: false },
    { day: 'Fri', active: true },
    { day: 'Sat', active: true },
    { day: 'Sun', active: false },
  ]

  // Upcoming assessments
  const assessments = [
    { title: 'DSA Mock Test', date: 'Tomorrow', time: '10:00 AM', color: 'bg-blue-100 text-blue-600' },
    { title: 'System Design Review', date: 'Wed', time: '2:00 PM', color: 'bg-purple-100 text-purple-600' },
    { title: 'HR Interview Prep', date: 'Friday', time: '11:00 AM', color: 'bg-green-100 text-green-600' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Overall Readiness - Circular Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
            <CardDescription>Your placement preparation score</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress value={72} max={100} />
            <p className="mt-4 text-sm font-medium text-gray-600">Readiness Score</p>
          </CardContent>
        </Card>

        {/* 2. Skill Breakdown - Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Performance across key areas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="hsl(245, 58%, 51%)"
                  fill="hsl(245, 58%, 51%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Continue Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <span className="text-xl font-bold text-orange-600">DP</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Dynamic Programming</h4>
                <p className="text-sm text-gray-500">3 of 10 problems completed</p>
              </div>
            </div>
            <ProgressBar current={3} total={10} color="bg-orange-500" />
            <button className="mt-4 w-full bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Continue
            </button>
          </CardContent>
        </Card>

        {/* 4. Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>Track your daily progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Problems Solved</span>
                <span className="text-sm text-gray-500">12 / 20 this week</span>
              </div>
              <ProgressBar current={12} total={20} />
            </div>
            <div className="flex justify-between mt-6">
              {weekDays.map((item, index) => (
                <DayCircle key={index} day={item.day} active={item.active} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 5. Upcoming Assessments - Full Width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Your scheduled tests and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessments.map((assessment, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assessment.color}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{assessment.title}</h4>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{assessment.date}, {assessment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Dashboard
