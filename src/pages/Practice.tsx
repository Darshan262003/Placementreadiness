function Practice() {
  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', status: 'Solved' },
    { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack', status: 'Attempted' },
    { id: 3, title: 'Merge K Sorted Lists', difficulty: 'Hard', category: 'Linked List', status: 'Unsolved' },
    { id: 4, title: 'Binary Tree Level Order', difficulty: 'Medium', category: 'Tree', status: 'Unsolved' },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved': return 'text-green-600'
      case 'Attempted': return 'text-yellow-600'
      default: return 'text-gray-400'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Problems</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
          <option>All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
          <option>All Categories</option>
          <option>Arrays</option>
          <option>Stack</option>
          <option>Linked List</option>
          <option>Tree</option>
        </select>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Title</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Difficulty</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className={`px-6 py-4 font-medium ${getStatusColor(problem.status)}`}>
                  {problem.status}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{problem.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{problem.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Practice
