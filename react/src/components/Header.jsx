import { NavLink } from "react-router-dom";

export default function HeaderComponent() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top navbar-fixed-transparent d-flex justify-content-center">
        <img src="/logo_navbar1.png" alt="logo" className="logo_navbar" />
        <ul className="navbar-nav ms-auto d-flex flex-row gap-3">
          <li className="nav-item">
            <NavLink className="link-underline link-underline-opacity-0" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="link-underline link-underline-opacity-0"
              to="/aboutus"
            >
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="link-underline link-underline-opacity-0"
              to="/videogames"
            >
              Videogames
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
