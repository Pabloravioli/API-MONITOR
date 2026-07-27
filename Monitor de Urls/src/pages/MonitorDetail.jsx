import { useState,  useEffect} from "react"
import { useParams } from "react-router-dom"






function MonitorDetail() {
  const {id} = useParams()
  const[monitor, setMonitor] = useState(null);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);
  
 

  useEffect(() => {
    
   fetch(`http://localhost:3000/monitor/${id}`)
    .then(res => res.json())
    .then(data =>{setMonitor(data.monitor)
     setLoading(false)})
    .catch(err => setError(err.message))
  },[])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>
 console.log(monitor)
 return (
   <div>
    <h1>Monitor Detail</h1>
    {id}
    <p>{monitor.url}</p>
    <p>{monitor.averageResponseTime}</p>
    <p>{monitor.lastResponseTime}</p>
    <p>{monitor.lastStatus}</p>
    <p>{monitor.successfulChecks}</p>
    <p>{monitor.uptimePercentage}</p>

  </div>
 )
}
export default MonitorDetail