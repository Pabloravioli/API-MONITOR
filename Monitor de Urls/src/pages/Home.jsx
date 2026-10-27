import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Home() {
  const [stats, setStats] = useState(null)
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/monitor/stats').then(r => r.json()),
      fetch('http://localhost:3000/monitor/summary').then(r => r.json())
    ])
      .then(([statsData, summaryData]) => {
        setStats(statsData)
        setMonitors(summaryData.summary)
        setLoading(false)
      })
      .catch(err => setError(err.message))
  }, [])

  if (loading) return <p className="p-8 text-gray-400">Cargando...</p>
  if (error) return <p className="p-8 text-red-400">Error: {error}</p>

  const uptime = stats.total > 0 ? Math.round((stats.activos / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-blue-500 px-4 py-8 sm:px-8 ">
      <div className="max-w-2xl mx-auto">
        <p className="text-red-500 text-4xl">Test Tailwind</p>

        <h1 className="text-xl font-medium text-gray-800 mb-6">Dashboard</h1>

        {/* Cards de stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-medium text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Activos</p>
            <p className="text-2xl font-medium text-emerald-500">{stats.activos}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Caídos</p>
            <p className="text-2xl font-medium text-red-400">{stats.caidos}</p>
          </div>
        </div>

        {/* Barra de uptime */}
        <div className="bg-white rounded-xl p-5 mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Uptime promedio</span>
            <span className="font-medium text-gray-700">{uptime}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${uptime}%` }}
            />
          </div>
        </div>

        {/* Lista de monitores */}
        <div className="bg-white rounded-xl p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Monitores</p>
          <div className="divide-y divide-gray-100">
            {monitors.map(m => (
              <Link
                key={m._id}
                to={`/monitors/${m._id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${m.lastStatus === 200 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-gray-700 truncate">{m.url}</span>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ml-3 ${m.lastStatus === 200 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {m.lastStatus === 200 ? 'Activo' : 'Caído'}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home