import routes from '../lib/routes'
import {Link} from 'react-router-dom'

export default function Navbar(props) {
  return (
    <nav className="navbar fixed-bottom navbar-expand-md navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Audio Transformer</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {routes.map((route, idx) => {
              if(!route.skipNav) {
                return (
                  <li key={idx} className="nav-item">
                    <Link className="nav-link" to={route.path}>{route.name}</Link>
                  </li>
                )
              } else return null
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}

//   <li className="nav-item">
//     <a className="nav-link active" aria-current="page" href="#">Home</a>
//   </li>
//   <li className="nav-item">
//     <a className="nav-link" href="#">Link</a>
//   </li>
//   <li className="nav-item">
//     <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
//   </li>
// </ul>
// <form className="d-flex">
//   <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
//   <button className="btn btn-outline-success" type="submit">Search</button>
// </form>
