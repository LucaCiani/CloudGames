import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

export default function HeaderComponent() {
  return (
    <nav className="navbar navbar-expand-md navbar-dark sticky-top navbar-fixed-transparent">
      <div class="container">
        <Link to={"/"} className="navbar-brand">
          <img src="/logo_navbar1.png" alt="logo" className="logo_navbar" />
        </Link>
        <button
          class="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
          <ul class="navbar-nav m-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <NavLink
                to="/"
                className={`nav-link ${({ isActive }) =>
                  isActive ? "active" : ""}`}
              >
                Home
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink
                to="/videogames"
                className={`nav-link ${({ isActive }) =>
                  isActive ? "active" : ""}`}
              >
                Videogiochi
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink
                to="/aboutus"
                className={`nav-link ${({ isActive }) =>
                  isActive ? "active" : ""}`}
              >
                About Us
              </NavLink>
            </li>
          </ul>
          <form class="d-flex my-2 my-lg-0">
            <div className="search-bar d-flex align-items-center gap-2">
              <input type="text" placeholder="Search" />
              <button class="search-btn" type="submit">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}
