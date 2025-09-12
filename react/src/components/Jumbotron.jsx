import { Link } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import { useState, useEffect, useCallback } from "react";

export default function Jumbotron() {
  const { videogames } = useGlobalContext();
  const [videogame, setVideogame] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  useEffect(() => {
    if (videogames) {
      const randomIndex = Math.floor(Math.random() * videogames.length);
      setVideogame(videogames[randomIndex]);
      setCurrentImageIndex(0);
      setPreloadedImages(new Set());
    }
  }, [videogames]);

  const preloadImage = useCallback(
    (url) => {
      return new Promise((resolve) => {
        if (preloadedImages.has(url)) {
          resolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          setPreloadedImages((prev) => new Set(prev).add(url));
          resolve();
        };
        img.onerror = () => resolve(); // Continue even if image fails to load
        img.src = url;
      });
    },
    [preloadedImages]
  );

  useEffect(() => {
    if (!videogame) return;

    const images = videogame.media.filter((item) => item.type === "img");
    if (images.length <= 1) return;

    const interval = setInterval(async () => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const nextImageUrl = images[nextIndex].url;

      // Preload the next image
      await preloadImage(nextImageUrl);

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(nextIndex);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [videogame, currentImageIndex, preloadedImages, preloadImage]);

  const truncate = (text, max = 150) => {
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "...";
  };

  const images = videogame?.media.filter((item) => item.type === "img") || [];
  const currentImage = images[currentImageIndex];

  return (
    <div className="header-img-container">
      {videogame && (
        <>
          {currentImage && (
            <img
              src={currentImage.url}
              alt="In primo piano"
              className="jumbotron-img img-fluid w-100"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          )}
          <div className="position-absolute top-0 d-flex justify-content-center align-items-between h-100 w-100">
            <div className="jumbotron-text text-center text-white d-flex flex-column justify-content-center align-items-center p-4 h-100">
              <h1 className="display-4 fw-bold">{videogame.name}</h1>
              <p className="lead jumbo-description">
                {truncate(videogame.description, 150)}
              </p>
              <Link
                to={`/videogames/${videogame.slug}`}
                className="btn-gradient"
              >
                Scopri di più
              </Link>
            </div>
          </div>
          <div className="position-absolute on-display">
            <span className="badge bg-main">IN PRIMO PIANO</span>
          </div>
        </>
      )}
    </div>
  );
}
