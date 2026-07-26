import { useState,  useEffect} from "react"
import { useParams } from "react-router-dom"

const params = useParams();


function MonitorDetail() {
  fetch('http://localhost:3000/monitor')
  return <h1>Monitor Detail</h1>
}

export default MonitorDetail