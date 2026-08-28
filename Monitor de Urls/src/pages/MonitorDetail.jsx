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
        labels: checks.map((_, i) => i + 1),
        datasets: [{
          label: 'Tiempo de respuesta (ms)',
          data: checks.map(c => c.responseTime),
          backgroundColor: '#3b82f6'
        }]
      }
    })
  }, [checks])

  if (loading) return <p className="p-4">Cargando...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">{monitor.url}</h1>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${monitor.lastStatus === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {monitor.lastStatus === 200 ? 'Activo' : 'Error'}
      </span>

      <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Uptime</p>
          <p className="text-2xl font-semibold text-green-600">{monitor.uptimePercentage}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Tiempo promedio</p>
          <p className="text-2xl font-semibold">{monitor.averageResponseTime} ms</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Último tiempo</p>
          <p className="text-2xl font-semibold">{monitor.lastResponseTime} ms</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Checks exitosos</p>
          <p className="text-2xl font-semibold">{monitor.successfulChecks} / {monitor.totalChecks}</p>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-500 mb-4">Historial de tiempo de respuesta</p>
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

export default MonitorDetail