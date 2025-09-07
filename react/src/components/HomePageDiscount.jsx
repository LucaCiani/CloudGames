import { Link } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import { useState, useEffect } from "react";

export default function HomePageDiscount() {
  const { videogames } = useGlobalContext();
  const [hoveredVideo, setHoveredVideo] = useState(null);

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

  // Funzione per navigare al media precedente nello slider (LOGICA CIRCOLARE)
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      // Se siamo al primo elemento (0), vai all'ultimo, altrimenti vai al precedente
      prev === 0
        ? Math.max(0, filteredVideogames.length - visibleSlides)
        : prev - 1
    );
  };

  // Funzione per navigare al media successivo nello slider (LOGICA CIRCOLARE)
  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, filteredVideogames.length - visibleSlides);
      // Se siamo all'ultimo elemento, torna istantaneamente al primo
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  // Converte URL YouTube in embed con autoplay
  const getEmbedVideoUrl = (videogame) => {
    const video = videogame.media?.find((media) => media.type === "video");
    if (!video) return null;

    // Estrae l'ID del video da YouTube
    const videoId = video.url.split("/").pop();

    // Crea URL embed con autoplay e mute
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;
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
          className="btn btn-light position-absolute top-50 translate-middle-y"
          style={{ left: "-15px", zIndex: 2 }}
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
                  <div
                    className="card border-0 h-100"
                    onMouseEnter={() => setHoveredVideo(videogame.id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                    style={{
                      transform:
                        hoveredVideo === videogame.id
                          ? "scale(1.05)"
                          : "scale(1)",
                      transition: "transform 0.3s ease",
                      zIndex: hoveredVideo === videogame.id ? 10 : 1,
                    }}
                  >
                    {/* Video in hover con autoplay */}
                    {hoveredVideo === videogame.id &&
                    getEmbedVideoUrl(videogame) ? (
                      <iframe
                        src={getEmbedVideoUrl(videogame)}
                        className="card-img-top rounded"
                        style={{
                          height: "220px",
                          width: "100%",
                          border: "none",
                          pointerEvents: "none", // Disabilita il click sul video
                        }}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    ) : (
                      /* Immagine di default */
                      <img
                        src={videogame.image_url}
                        alt={videogame.name}
                        className="card-img-top rounded"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                      <span className="fw-bold text-truncate">
                        {videogame.name}
                      </span>
                      <span className="fw-bold">
                        {videogame.promo_price ? (
                          <>
                            <span className="text-success">
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
          className="btn btn-light position-absolute top-50 translate-middle-y"
          style={{ right: "-15px", zIndex: 2 }}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
