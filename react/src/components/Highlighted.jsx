import { Link } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import { useState, useEffect } from "react";

export default function Highlighted() {
    const { videogames } = useGlobalContext();
    const [hgVideogames, setHgVideogames] = useState([]);

    useEffect(() => {
        // Filtra videogiochi in evidenza (a random, max 15)
        const filteredVideogames =
            videogames
                ?.map((vg) => vg)
                .sort(() => 0.5 - Math.random())
                .slice(0, 15) || [];

        setHgVideogames(filteredVideogames);
    }, [videogames]);

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
        if (currentIndex < hgVideogames.length - visibleSlides)
            setCurrentIndex(currentIndex + 1);
    };

    return (
        <div className="container my-5 text-center text-main">
            <h1>Giochi di tendenza</h1>
            <h4 className="text-secondary fs-5 mb-4">
                Scopri i titoli più amati e giocati del momento, scelti per te!
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
                        {hgVideogames.map((videogame) => (
                            <div
                                key={videogame.id}
                                className="p-2"
                                style={{
                                    flex: `0 0 ${100 / visibleSlides}%`,
                                    maxWidth: `${100 / visibleSlides}%`,
                                }}
                            >
                                <Link
                                    to={`/videogames/${videogame.id}`}
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
                                                            €
                                                            {
                                                                videogame.promo_price
                                                            }
                                                        </span>{" "}
                                                        <span className="text-decoration-line-through text-secondary">
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
                    disabled={
                        currentIndex >= hgVideogames.length - visibleSlides
                    }
                >
                    &#10095;
                </button>
            </div>
        </div>
    );
}
