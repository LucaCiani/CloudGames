import { useState, useRef } from "react";
import Shuffle from "./Shuffle";
import { Link } from "react-router-dom";
import "../gameover404.css";

export default function NotFound() {
  // Numero massimo di monete da raccogliere
  const maxCoins = 10;
  // Numero massimo di monete animate contemporaneamente
  const animatedCoins = 6;

  // Stato: array di oggetti moneta, ognuna con posizione, durata animazione, delay, stato raccolta e id unico
  const [coins, setCoins] = useState(
    Array.from({ length: maxCoins }).map(() => {
      // Scegli casualmente se la moneta va a sinistra o a destra
      const isLeft = Math.random() < 0.5;
      // Per evitare che le monete vadano troppo vicino ai bordi:
      // Sinistra: tra 8% e 22%, Destra: tra 78% e 92%
      const left = isLeft
        ? 8 + Math.random() * 14 // 8% - 22%
        : 78 + Math.random() * 14; // 78% - 92%
      return {
        left,
        duration: 5 + Math.random() * 4, // durata animazione random
        delay: Math.random() * 3, // delay random per effetto pioggia naturale
        collected: false, // stato raccolta
        id: Math.random().toString(36).slice(2), // id unico
      };
    })
  );

  // Stato: quante monete sono state raccolte
  const [coinsCollected, setCoinsCollected] = useState(0);

  // Stato: mostra/nascondi popup sconto
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);

  // Ref per evitare click multipli contemporanei sulle monete
  const collecting = useRef(false);

  /**
   * Gestisce il click su una moneta:
   * - Segna la moneta come raccolta (collected: true)
   * - Incrementa il contatore
   * - Se sono state raccolte tutte, mostra il popup dopo breve delay
   */
  const handleCoinClick = (id) => {
    if (collecting.current) return; // evita doppio click
    collecting.current = true;
    setCoins((prev) =>
      prev.map((coin) =>
        coin.id === id && !coin.collected ? { ...coin, collected: true } : coin
      )
    );
    setCoinsCollected((prev) => {
      const newCount = prev + 1;
      if (newCount === maxCoins) {
        // Mostra il popup sconto dopo breve delay per effetto visivo
        setTimeout(() => setShowDiscountPopup(true), 400);
      }
      // Sblocca la possibilità di cliccare dopo breve tempo
      setTimeout(() => {
        collecting.current = false;
      }, 200);
      return newCount;
    });
  };

  /**
   * Chiude il popup sconto:
   * - Nasconde il popup
   * - (Non resetta il gioco: il minigioco resta completato)
   */
  const closeDiscount = () => {
    setShowDiscountPopup(false);
  };

  // Torna alla pagina precedente
  const goBack = () => window.history.back();

  return (
    <>
      {/* Pioggia di monete animate e cliccabili */}
      <div className="rain">
        {coins
          .filter((coin) => !coin.collected)
          .slice(0, animatedCoins) // mostra solo le prime N non raccolte
          .map((coin) => (
            <img
              key={coin.id}
              src="/moneta.png"
              alt="Moneta"
              className="drop coin-animated"
              style={{
                left: `${coin.left}%`,
                animationDuration: `${coin.duration}s`,
                animationDelay: `${coin.delay}s`,
              }}
              onClick={() => handleCoinClick(coin.id)}
              draggable={false}
            />
          ))}
      </div>

      {/* Contenuto principale della pagina */}
      <div className="container d-flex flex-column align-items-center justify-content-around min-vh-100 py-4 text-center position-relative">
        {/* Titolo animato */}
        <Shuffle
          text="ERROR 404"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
        />

        {/* Descrizione sotto il titolo */}
        <p className="notfound-description">
          Ops! Sembra che tu abbia perso una vita! La pagina che cerchi non
          esiste nel nostro universo gaming.
          <br />
          Respawn alla home page o torna al menu principale per continuare
          l'avventura.
        </p>

        {/* Statistiche gaming */}
        <div className="notfound-gaming-stats">
          <div className="notfound-stat">
            <img src="luffy.png" alt="img Luffy D. Monkey" />
            <span className="notfound-stat-text">Achievement: "Explorer"</span>
            <span className="notfound-stat-text">
              Hai trovato l’Isola Misteriosa 404
            </span>
          </div>
          <div className="notfound-stat">
            <img src="snorlax.png" alt="Snorlak Pokemon" />
            <span className="notfound-stat-text">Non puoi passare,</span>
            <span className="notfound-stat-text">
              Snorlax blocca la strada!
            </span>
          </div>
        </div>

        {/* Bottoni di navigazione e contatore monete */}
        <div className="container my-4">
          <div className="row justify-content-center align-items-center g-3">
            {/* Contatore monete (puoi aggiungere qui se vuoi un box separato) */}
            <div className="col-12 col-md-auto order-1 order-md-3 d-flex justify-content-center justify-content-md-end"></div>
            {/* Bottoni */}
            <div className="col-12 col-md-auto order-2 order-md-2 d-flex flex-column flex-md-row justify-content-center align-items-center">
              <Link to="/" className="notfound-btn notfound-btn-secondary">
                🏠 Respawn alla Home
              </Link>
              <button
                className="notfound-btn notfound-btn-secondary"
                onClick={goBack}
              >
                ⏪ Menu Precedente
              </button>
            </div>
          </div>
        </div>

        {/* Contatore monete raccolte */}
        <div className="notfound-btn notfound-btn-secondary">
          <img src="/moneta.png" alt="Moneta" />
          <span className="coin-counter-text">
            {coinsCollected}/{maxCoins}
          </span>
        </div>
      </div>

      {/* Popup sconto che appare quando tutte le monete sono raccolte */}
      {showDiscountPopup && (
        <div
          className={`notfound-discount-popup-overlay ${
            showDiscountPopup ? "active" : ""
          }`}
          onClick={closeDiscount}
        >
          <div
            className="notfound-discount-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="Pokepopup.png" alt="Pokemon Popup" />
            <h3>CONGRATULAZIONI!</h3>
            <p>
              Hai raccolto tutte le {maxCoins} monete! Ecco il tuo codice
              sconto:
            </p>
            <div className="notfound-discount-code">GAME404</div>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Sconto del 10% su tutti i giochi!
            </p>
            <button onClick={closeDiscount} className="notfound-btn">
              Fantastico!{" "}
              <img
                src="pad.png"
                alt="pad"
                style={{ width: "32px", height: "32px" }}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
