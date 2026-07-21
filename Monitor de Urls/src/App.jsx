import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Monitors from './pages/Monitors'
import MonitorDetail from './pages/MonitorDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/monitors" element={<Monitors />} />
      <Route path="/monitors/:id" element={<MonitorDetail />} />
    </Routes>
  )
}

export default App