import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Chart } from 'chart.js/auto'

function MonitorDetail() {
  const { id } = useParams()
  const [monitor, setMonitor] = useState(null);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    fetch(`http://localhost:3000/monitor/${id}`)
      .then(res => res.json())
      .then(data => {
        setMonitor(data.monitor)
        setChecks(data.checks)
        setLoading(false)
      })
      .catch(err => setError(err.message))
  }, [])

  useEffect(() => {
    if (checks.length === 0) return
    if (chartInstance.current) chartInstance.current.destroy()
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: checks.slice(-20).map((_, i) => i + 1),
        datasets: [{
          label: 'Tiempo de respuesta (ms)',
          data: checks.slice(-20).map(c => c.responseTime),
          backgroundColor: checks.slice(-20).map(c => c.status === 200 ? '#22c55e' : '#ef4444')
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    })
  }, [checks])

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 truncate">{monitor.url}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${monitor.lastStatus === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {monitor.lastStatus === 200 ? 'Activo' : 'Error'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Estado</p>
          <p className={`text-xl font-bold ${monitor.lastStatus === 200 ? 'text-green-600' : 'text-red-500'}`}>{monitor.lastStatus}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Uptime</p>
          <p className="text-xl font-bold text-gray-800">{monitor.uptimePercentage.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Tiempo promedio</p>
          <p className="text-xl font-bold text-gray-800">{monitor.averageResponseTime.toFixed(0)} ms</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total checks</p>
          <p className="text-xl font-bold text-gray-800">{monitor.totalChecks}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-500 mb-4">Tiempo de respuesta (últimos 20 checks)</p>
        <canvas ref={chartRef} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-500 mb-3">Últimos 10 checks</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-2">Estado</th>
              <th className="pb-2">Tiempo</th>
              <th className="pb-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {checks.slice(-10).reverse().map(check => (
              <tr key={check._id} className="border-b border-gray-50">
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${check.status === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {check.status}
                  </span>
                </td>
                <td className="py-2 text-gray-600">{check.responseTime} ms</td>
                <td className="py-2 text-gray-400">{new Date(check.checkedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-3">Información</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">URL</span>
            <span className="text-gray-700">{monitor.url}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Creado</span>
            <span className="text-gray-700">{new Date(monitor.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Checks realizados</span>
            <span className="text-gray-700">{monitor.totalChecks}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonitorDetail