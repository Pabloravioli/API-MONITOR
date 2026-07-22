import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <nav>
        <Link to= '/' >home</Link>
        <Link to= '/monitors' >Monitores</Link>
        

    </nav>
  )
}

export default Navbar