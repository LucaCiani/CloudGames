import { useEffect, useState } from "react";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenAcknowledged, setHasBeenAcknowledged] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const acknowledged = localStorage.getItem("welcomePopupAcknowledged");
    if (acknowledged === "true") {
      setHasBeenAcknowledged(true);
      setIsVisible(false);
    } else {
      setHasBeenAcknowledged(false);
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (hasBeenAcknowledged) {
      localStorage.setItem("welcomePopupAcknowledged", "true");
    }
  }, [hasBeenAcknowledged]);

  const acknowledgeAndClose = () => {
    setIsVisible(false);
    setHasBeenAcknowledged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      acknowledgeAndClose();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/emails/newsletter`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        if (res.status === 400) {
          throw new Error("Indirizzo email non valido");
        }

        throw new Error(data.error || "Subscription failed");
      }
      setSuccess("Email inviata! Benvenuto nella newsletter.");
      // Short delay then close & acknowledge
      setTimeout(() => acknowledgeAndClose(), 2000);
    } catch (err) {
      if (err.status === 400) {
        setError("Indirizzo email non valido");
      } else {
        console.error(err);
        setError(err.message || "Errore durante l'iscrizione");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    isVisible && (
      <div
        className="modal show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark" style={{ zIndex: 1055 }}>
            <div className="modal-header">
              <h5 className="modal-title">Benvenuto su CloudGames!</h5>
              <button
                type="button"
                className="btn-close bg-white"
                aria-label="Close"
                onClick={acknowledgeAndClose}
                disabled={submitting}
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-3">
                Iscriviti alla nostra newsletter per ricevere gli ultimi
                aggiornamenti e offerte!
              </p>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success py-2" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <input
                    id="welcome-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-control"
                    disabled={submitting}
                  />
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn-gradient m-0 w-100"
                    disabled={submitting}
                  >
                    {submitting ? "Invio..." : "Iscrivimi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
