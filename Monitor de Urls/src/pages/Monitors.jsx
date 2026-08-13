import { useState,  useEffect} from "react"
import {Link} from 'react-router-dom'


function Monitors() {
  const[monitors, setMonitors] = useState([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);
  
 

  useEffect(() => {
    fetch ('http://localhost:3000/monitor')
    .then(res => res.json())
    .then(data =>{setMonitors(data.monitors)
     setLoading(false)})
    .catch(err => setError(err.message))
  },[])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>
 return (
  <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Monitores</h1>
      <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
            <th className="pb-3 font-medium">URL</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium">Uptime</th>
            <th className="pb-3 font-medium">Tiempo de respuesta</th>
          </tr>
        </thead>
        <tbody>
          {monitors.map(monitor => (
            <tr key={monitor._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4">
                <Link to={`/monitors/${monitor._id}`} className="text-blue-600 hover:underline">
                  {monitor.url}
                </Link>
              </td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${monitor.lastStatus === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {monitor.lastStatus === 200 ? 'Activo' : 'Error'}
                </span>
              </td>
              <td className="py-4 text-sm">{monitor.uptimePercentage}%</td>
              <td className="py-4 text-sm">{monitor.averageResponseTime} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  
  
)
   
}

export default Monitors