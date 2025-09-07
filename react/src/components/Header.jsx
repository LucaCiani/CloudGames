import { NavLink } from "react-router-dom";

export default function HeaderComponent() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top navbar-fixed-transparent">
      <div className="container-fluid d-flex justify-content-around align-items-center">
        <img src="/logo_navbar1.png" alt="logo" className="logo_navbar" />
        <ul className="navbar-nav d-flex flex-row gap-3">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/aboutus">
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/videogames">
              Videogames
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}