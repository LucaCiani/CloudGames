import {
  NavLink,
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

export default function HeaderComponent() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Prendi cartItems dal GlobalContext
  const { cartItems = [] } = useContext(GlobalContext);

  // Calcola la quantità totale degli articoli
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.cartQuantity || 1),
    0
  );

  // Effect to manage search query persistence and clearing
  useEffect(() => {
    if (!searchParams.get("search")) {
      // Clear search when navigating to other pages
      setSearch("");
    }
  }, [location.pathname, searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(
        `/videogames?search=${encodeURIComponent(search.toLowerCase().trim())}`
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark sticky-top navbar-fixed-transparent">
      <div className="container d-flex justify-content-between align-items-center gap-4 ">
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

          <form className="my-4 my-lg-0" onSubmit={handleSubmit}>
            <div className="search-bar gap-2">
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
            className="cart-icon-40 position-relative d-flex align-items-center justify-content-center p-0 ms-3 mb-3 mb-md-0"
            type="button"
            aria-label="Apri carrello"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            style={{ width: "40px", height: "40px" }}
          >
            <i className="fa-solid fa-cart-arrow-down"></i>

            {totalQuantity > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "1rem", padding: "0.25em 0.4em" }}
              >
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
