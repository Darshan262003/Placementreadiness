import { TrendingUp, Target, Clock, Award } from 'lucide-react'

function Dashboard() {
  const stats = [
    { label: 'Problems Solved', value: '42', icon: Target, color: 'bg-blue-100 text-blue-600' },
    { label: 'Practice Hours', value: '18.5', icon: Clock, color: 'bg-green-100 text-green-600' },
    { label: 'Current Streak', value: '7 days', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
    { label: 'Rank', value: '#1,234', icon: Award, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Completed Two Sum problem</p>
              <p className="text-sm text-gray-500">Array • Easy • 15 mins ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Started Mock Interview Session</p>
              <p className="text-sm text-gray-500">Data Structures • 1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Achieved 7-day streak</p>
              <p className="text-sm text-gray-500">Achievement • 2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
