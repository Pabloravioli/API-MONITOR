import { response } from "express";

function Monitors() {
  const[monitors, setMonitors] = useState([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);

  useEffect(() => {
    fetch ('http://localhost:5173/monitors')
    .then(res =>{
      return res.json();
    })
    .then(data =>{
      console.log(data);

    },[]);

    return(
      <div className="">

      </div>
    )
    if (loading) return <p>Cargando...</p>
    if (error) return <p>Error: {error}</p>
    return <p>datos acá</p>
}

export default Monitors