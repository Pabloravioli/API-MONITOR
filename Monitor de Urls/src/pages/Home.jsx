import { useState, useEffect } from "react"

function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/monitor/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => setError(err.message))
  }, [])

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">Total de monitors</p>
          <span className="text-3xl font-bold">{stats.total}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">Activos</p>
          <span className="text-3xl font-bold text-green-600">{stats.activos}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">Caídos</p>
          <span className="text-3xl font-bold text-red-500">{stats.caidos}</span>
        </div>

        <div className="border-t border-gray-100 pt-4 flex gap-4">
          <div className="flex-1 bg-green-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.activos}</p>
            <p className="text-sm text-green-700 mt-1">Servicios funcionando</p>
          </div>
          <div className="flex-1 bg-red-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-500">{stats.caidos}</p>
            <p className="text-sm text-red-700 mt-1">Servicios caídos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home