import { useState,  useEffect} from "react";


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
 console.log(monitors)
 return (
   <div>
     {monitors.map(monitor => (
      <p key={monitor._id}>{monitor.url}</p>
    ))}
  </div>
)
   
}

export default Monitors