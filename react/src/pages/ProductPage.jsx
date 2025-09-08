import { useParams } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductPage() {
  // Recupera l'ID del prodotto dall'URL (es. /SingleVideogame/14)
  const { id } = useParams();

  // Ottiene l'array di tutti i videogiochi dal context globale
  const { videogames } = useGlobalContext();

  // State per tenere traccia di quale media (immagine/video) è attualmente visualizzato
  const [currentMediaIndex, setCurrentMediaIndex] = useState(5);

  // Trova il prodotto specifico confrontando l'ID dall'URL con quelli nell'array
  const SingleVideogame = videogames?.find((game) => game.id === parseInt(id));

  // Se il prodotto non viene trovato, mostra un messaggio di errore
  if (!SingleVideogame) {
    return (
      <div className="container my-5">
        <h2>Prodotto non trovato</h2>
      </div>
    );
  }

  // Funzione per navigare al media precedente nello slider
  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      // Se siamo al primo elemento (0), vai all'ultimo, altrimenti vai al precedente
      prev === 0 ? SingleVideogame.media.length - 1 : prev - 1
    );
  };

  // Funzione per navigare al media successivo nello slider
  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      // Se siamo all'ultimo elemento, torna al primo, altrimenti vai al successivo
      prev === SingleVideogame.media.length - 1 ? 0 : prev + 1
    );
  };

  // Ottiene il media attualmente selezionato (immagine o video)
  const currentMedia = SingleVideogame.media[currentMediaIndex];


  // Selezionare i videogiochi con gli stessi generi

  const relatedVideogames = videogames.filter(vg => {
    return SingleVideogame.genres.every(genre => vg.genres.includes(genre)) &&
      vg.id !== SingleVideogame.id;
  });

  console.log(relatedVideogames);







  return (
    <>
      <div className="container my-5">
        <div className="row">
          {/* SEZIONE SINISTRA - MEDIA E GALLERY */}
          <div className="col-lg-6 mb-4">
            {/* Container principale per il media con posizionamento relativo per i controlli */}
            <div className="position-relative">
              {/* Renderizza immagine o video in base al tipo del media corrente */}
              {currentMedia?.type === "img" ? (
                // Se è un'immagine, mostra un tag img
                <img
                  src={currentMedia.url}
                  alt={SingleVideogame.name}
                  className="img-fluid w-100 rounded shadow"
                  style={{ height: "400px", objectFit: "cover" }}
                />
              ) : (
                // Se è un video, mostra un iframe per YouTube
                <div className="ratio ratio-16x9">
                  <iframe
                    src={currentMedia.url}
                    title={SingleVideogame.name}
                    className="rounded shadow"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Controlli frecce per navigare tra i media (solo se ce n'è più di uno) */}
              {SingleVideogame.media.length > 1 && (
                <>
                  {/* Freccia sinistra - media precedente */}
                  <button
                    onClick={handlePrevMedia}
                    className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2"
                  >
                    &#10094;
                  </button>
                  {/* Freccia destra - media successivo */}
                  <button
                    onClick={handleNextMedia}
                    className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails - miniature di tutti i media per navigazione rapida */}
            <div className="row mt-3 g-2">
              {SingleVideogame.media.map((media, index) => (
                <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2">
                  <img
                    // Se è un'immagine usa l'URL diretto, se è video usa thumbnail YouTube
                    src={
                      media.type === "img"
                        ? media.url
                        : `https://img.youtube.com/vi/${media.url
                          .split("/")
                          .pop()}/mqdefault.jpg`
                    }
                    alt={`${SingleVideogame.name} ${index + 1}`}
                    // Aggiunge bordo blu se è il media attualmente selezionato
                    className={` cursor-pointer ${index === currentMediaIndex ? "border-primary border-3" : ""
                      }`}
                    style={{
                      width: "100%",
                      height: "70px",
                      objectFit: "cover",
                    }}
                    // Al click, cambia il media visualizzato
                    onClick={() => setCurrentMediaIndex(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEZIONE DESTRA - INFORMAZIONI PRODOTTO */}
          <div className="col-lg-6">
            {/* Titolo del prodotto */}
            <h1 className="mb-3">{SingleVideogame.name}</h1>

            {/* Valutazione e sviluppatore */}
            <div className="mb-3">
              <span className="me-2">
                ⭐ {parseFloat(SingleVideogame.vote).toString()}
              </span>
              <span className="text-secondary">
                Developer: {SingleVideogame.developer}
              </span>
            </div>

            {/* Sezione prezzo - mostra prezzo scontato se disponibile */}
            <div className="mb-3">
              {SingleVideogame.promo_price ? (
                // Se c'è un prezzo promozionale, mostra entrambi
                <>
                  <span className="h3 text-success me-2">
                    €{SingleVideogame.promo_price}
                  </span>
                  <span className="text-decoration-line-through text-secondary">
                    €{SingleVideogame.price}
                  </span>
                </>
              ) : (
                // Altrimenti mostra solo il prezzo normale
                <span className="h3">€{SingleVideogame.price}</span>
              )}
            </div>

            {/* Descrizione del prodotto */}
            <p className="mb-4">{SingleVideogame.description}</p>

            {/* Lista delle piattaforme supportate */}
            <div className="mb-3">
              <h6>Piattaforme:</h6>
              <div className="d-flex gap-2">
                {SingleVideogame.platforms.map((platform, index) => (
                  <span key={index} className={`badge ${platform.toLowerCase()}`}>
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Lista dei generi del gioco */}
            <div className="mb-3">
              <h6>Generi:</h6>
              <div className="d-flex gap-2">
                {SingleVideogame.genres.map((genre, index) => (
                  <span key={index} className={`badge genre-${genre.toLowerCase()}`}>
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Data di rilascio formattata in italiano */}
            <div className="mb-4">
              <h6>Data di rilascio:</h6>
              <span>
                {new Date(SingleVideogame.release_date).toLocaleDateString(
                  "it-IT"
                )}
              </span>
            </div>

            {/* Quantità disponibile in magazzino */}
            <div className="mb-4">
              <span className="text-success">
                {SingleVideogame.quantity > 0
                  ? `${SingleVideogame.quantity} disponibili`
                  : "Non disponibile"}
              </span>
            </div>




            {/* Pulsante di acquisto - disabilitato se non disponibile */}
            <button
              className="btn-gradient w-100"
              disabled={SingleVideogame.quantity === 0}
            >
              {SingleVideogame.quantity > 0
                ? "Aggiungi al carrello"
                : "Non disponibile"}
            </button>
          </div>
        </div>
      </div>
      <div className="py-5">
        <h3 className="text-center mb-5">
          Prodotti correlati
        </h3>
        <div className="row row-cols-sm-1 row-cols-md-3 row-cols-xl-4 px-5 mb-4 container-fluid">

          {relatedVideogames.slice(0, 4).map((relatedVg) => {
            return (
              <div key={relatedVg.id} className="col" style={{
                scale: 1
              }} >
                <Link
                  to={`/videogames/${relatedVg.id}`}
                  className="text-decoration-none"
                >
                  <div className="card border-0 h-100">
                    <img
                      src={relatedVg.image_url}
                      alt={relatedVg.name}
                      className="card-img-top rounded"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                      <span className="fw-bold text-truncate text-white">
                        {relatedVg.name}
                      </span>
                      <span>
                        {relatedVg.promo_price ? (
                          <>
                            <span className="text-success fw-bold">
                              €
                              {
                                relatedVg.promo_price
                              }
                            </span>{" "}
                            <span className="text-decoration-line-through text-secondary">
                              €
                              {
                                relatedVg.price
                              }
                            </span>
                          </>
                        ) : (
                          <>€{relatedVg.price}</>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}









        </div>
      </div>
    </>
  );
}
