import { Link } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import { useState, useEffect } from "react";

export default function HomePageDiscount() {
  const { videogames } = useGlobalContext();

  // Filtra solo i videogiochi con un promo_price
  const filteredVideogames =
    videogames?.filter((vg) => vg.promo_price !== null) || [];

  // Slider state con responsività
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);

  // Gestisce il numero di slide visibili in base alla larghezza dello schermo
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleSlides(1); // Mobile: 1 card
      } else if (width < 992) {
        setVisibleSlides(2); // Tablet: 2 card
      } else {
        setVisibleSlides(3); // Desktop: 3 card
      }
      setCurrentIndex(0); // Reset dell'indice quando cambia la dimensione
    };

    // Esegui al caricamento e ad ogni resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < filteredVideogames.length - visibleSlides)
      setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="container my-5 text-center text-main">
      <h1>Giochi in sconto</h1>
      <h4 className="text-secondary fs-5 mb-4">
        Scopri i titoli in sconto scelti per te!
      </h4>
      <div className="slider-wrapper position-relative">
        {/* Freccia sinistra */}
        <button
          onClick={handlePrev}
          className="btn btn-dark position-absolute top-50 translate-middle-y"
          style={{ left: "-15px", zIndex: 2 }}
          disabled={currentIndex === 0}
        >
          &#10094;
        </button>

        {/* Track */}
        <div className="overflow-hidden">
          <div
            className="d-flex"
            style={{
              transform: `translateX(-${
                currentIndex * (100 / visibleSlides)
              }%)`,
              transition: "transform 0.50s ease",
            }}
          >
            {filteredVideogames.map((videogame) => (
              <div
                key={videogame.id}
                className="p-2"
                style={{
                  flex: `0 0 ${100 / visibleSlides}%`,
                  maxWidth: `${100 / visibleSlides}%`,
                }}
              >
                <Link
                  to={`/product/${videogame.id}`}
                  className="text-decoration-none"
                >
                  <div className="card border-0 h-100">
                    <img
                      src={videogame.image_url}
                      alt={videogame.name}
                      className="card-img-top rounded"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                      <span className="fw-bold text-truncate">
                        {videogame.name}
                      </span>
                      <span>
                        {videogame.promo_price ? (
                          <>
                            <span className="text-success fw-bold">
                              €{videogame.promo_price}
                            </span>{" "}
                            <span className="text-secondary text-decoration-line-through">
                              €{videogame.price}
                            </span>
                          </>
                        ) : (
                          <>€{videogame.price}</>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Freccia destra */}
        <button
          onClick={handleNext}
          className="btn btn-dark position-absolute top-50 translate-middle-y"
          style={{ right: "-15px", zIndex: 2 }}
          disabled={currentIndex >= filteredVideogames.length - visibleSlides}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
