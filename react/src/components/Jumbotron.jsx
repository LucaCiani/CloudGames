import { Link } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import { useState, useEffect } from "react";

export default function Jumbotron() {
  const { videogames } = useGlobalContext();
  const [videogame, setVideogame] = useState(null);

  useEffect(() => {
    if (videogames) {
      const randomIndex = Math.floor(Math.random() * videogames.length);
      setVideogame(videogames[randomIndex]);
    }
  }, [videogames]);

  // Helper: truncate text to `max` chars and append ellipsis if trimmed
  const truncate = (text, max = 150) => {
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "...";
  };

  return (
    <div className="header-img-container">
      {videogame && (
        <>
          <div className="position-absolute top-0 d-flex justify-content-center align-items-between h-100 w-100">
            <div className="jumbotron-text text-center text-white d-flex flex-column justify-content-center align-items-center p-4 h-100">
              <h1 className="display-4 fw-bold">{videogame.name}</h1>
              <p className="lead jumbo-description">
                {truncate(videogame.description, 150)}
              </p>
              <Link to={`/videogames/${videogame.slug}`} className="btn-gradient">
                Scopri di più
              </Link>
            </div>
          </div>
          <div className="position-absolute on-display">
            <span className="badge bg-main">IN PRIMO PIANO</span>
          </div>
          <img
            src={videogame.media.filter((img) => img.type === "img")[0].url}
            alt="In primo piano"
            className="jumbotron-img img-fluid w-100"
          />
        </>
      )}
    </div>
  );
}
