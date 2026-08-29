import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'

function Monitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/monitor/summary')
      .then(res => res.json())
      .then(data => {
        setMonitors(data.summary)
        setLoading(false)
      })
      .catch(err => setError(err.message))
  }, [])

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Monitores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monitors.map(monitor => (
          <Link to={`/monitors/${monitor._id}`} key={monitor._id}>
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${monitor.lastStatus === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {monitor.lastStatus === 200 ? 'Activo' : 'Error'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate mb-4">{monitor.url}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>
                  <p>Último tiempo</p>
                  <p className="text-gray-800 font-medium">{monitor.lastResponseTime} ms</p>
                </div>
                <div>
                  <p>Último check</p>
                  <p className="text-gray-800 font-medium">{new Date(monitor.lastCheckedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Monitors