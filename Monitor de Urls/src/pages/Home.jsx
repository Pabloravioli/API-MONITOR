import { useState,  useEffect} from "react"




function Home() {
  const[listMonitor, setlistMonitor] = useState([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);

  useEffect(()=>{

    fetch ('http://localhost:3000/monitor/summary')
    .then(res => res.json())
    .then(data =>{setlistMonitor(data.summary)
      console.log(data)
     setLoading(false)})
    .catch(err => setError(err.message))
  },[])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  return(
  <div>
  {listMonitor.map(monitor => (
  <div key={monitor.url}>
    <p>{monitor.url}</p>
    <p>{monitor.lastStatus}</p>
    <p>{monitor.uptimePercentage}</p>
    <p>{monitor.averageResponseTime}</p>
  </div>
    )
  )
  }
  </div>
)
}
  

export default Home 