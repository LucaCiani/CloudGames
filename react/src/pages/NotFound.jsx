import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../gameover404.css";

export default function NotFound() {
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  

  const showDiscount = () => {
    setShowDiscountPopup(true);
  };

  const closeDiscount = () => {
    setShowDiscountPopup(false);
  };

  return (
    <div className="notfound-game-over-container">
      <div className="notfound-container">
        <div className="notfound-error-code">404</div>
        <h1 className="notfound-error-title">Game Over - Pagina Non Trovata</h1>
        <p className="notfound-error-message">
          Ops! Sembra che tu abbia perso una vita! La pagina che cerchi non
          esiste nel nostro universo gaming.
          <br />
          Respawn alla home page o torna al menu principale per continuare
          l'avventura.
        </p>

        {/* Gaming Stats */}
        <div className="notfound-gaming-stats">
          <div className="notfound-stat">
            <span className="notfound-stat-icon">💀</span>
            <span className="notfound-stat-text">Errore 404</span>
          </div>
          <div className="notfound-stat">
            <span className="notfound-stat-icon">🏆</span>
            <span className="notfound-stat-text">Achievement: "Explorer"</span>
          </div>
          <div
            className="notfound-stat notfound-clickable"
            onClick={showDiscount}
          >
            <span className="notfound-stat-icon">⭐</span>
            <span className="notfound-stat-text">Clicca qui!</span>
          </div>
        </div>

        <div>
          <Link className="notfound-btn" to="/">
            🏠 Respawn alla Home
          </Link>
          <button
            className="notfound-btn notfound-btn-secondary"
            onClick={() => window.history.back()}
          >
            ⏪ Menu Precedente
          </button>
        </div>

        {/* Gaming Footer */}
        <div className="notfound-gaming-footer">
          <p>
            🎯 Suggerimento: Prova a cercare nei nostri giochi più popolari!
          </p>
          <div className="notfound-game-genres">
            <span className="notfound-genre">🏎️ Racing</span>
            <span className="notfound-genre">⚔️ Action</span>
            <span className="notfound-genre">🧩 Puzzle</span>
            <span className="notfound-genre">🏆 Sports</span>
          </div>
        </div>
      </div>

      {/* Popup Sconto */}
      {showDiscountPopup && (
        <div
          className="notfound-discount-popup-overlay"
          onClick={closeDiscount}
        >
          <div
            className="notfound-discount-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notfound-popup-icon">🎉</div>
            <h3>CONGRATULAZIONI!</h3>
            <p>Hai sbloccato uno sconto speciale!</p>
            <div className="notfound-discount-code">
              <p className="notfound-code">Codice: GAME404</p>
              <p className="notfound-description">
                Sconto del 10% su tutti i giochi!
              </p>
            </div>
            <button onClick={closeDiscount} className="notfound-popup-btn">
              Fantastico! 🎮
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
