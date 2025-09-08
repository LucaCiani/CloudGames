import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HeaderComponent() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/videogames?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark sticky-top navbar-fixed-transparent">
      <div className="container">
        <Link to={"/"} className="navbar-brand">
          <img src="/logo_navbar1.png" alt="logo" className="logo_navbar" />
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav m-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/videogames"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Videogames
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                About Us
              </NavLink>
            </li>
          </ul>
          <form className="d-flex my-2 my-lg-0" onSubmit={handleSubmit}>
            <div className="search-bar d-flex align-items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn" type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>

          <button
            className="btn position-relative"
            type="button"
            aria-label="Apri carrello"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
          >
            <i
              className="fa-solid fa-cart-arrow-down"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3<span className="visually-hidden">prodotti nel carrello</span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
