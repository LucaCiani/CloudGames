import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100 py-5 my-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Pagina non trovata</h2>
      <Link to="/" className="btn-gradient">
        Torna alla Home
      </Link>
    </div>
  );
}
