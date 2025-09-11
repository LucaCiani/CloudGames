import { useState, useContext, useCallback, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
    email: "",
  });
  const { cartItems, setCartItems } = useContext(GlobalContext);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [discountId, setDiscountId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountStatus, setDiscountStatus] = useState({
    message: "Premi Invio per applicare",
    color: "",
  });
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [submissionError, setSubmissionError] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const totalAmount = useCallback(
    (cartItems) => {
      const subtotal = cartItems.reduce((total, item) => {
        const price = item.promo_price || item.price || 0;
        const qty = item.cartQuantity || 1;
        return total + price * qty;
      }, 0);

      const discountAmount = (subtotal * (discountPercentage || 0)) / 100;
      return (subtotal - discountAmount).toFixed(2);
    },
    [discountPercentage]
  );

  const handleFormData = (e) => {
    const { name, value } = e.target;

    if (name === "postal_code") {
      const numericValue = parseInt(value, 10);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: isNaN(numericValue) ? "" : numericValue,
      }));
    } else if (name === "country") {
      // Nuova condizione per countryInitials
      const countryInitials = value.toUpperCase();
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: countryInitials,
      })); // Converti in maiuscolo
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return; // evita doppi invii
      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        const orderData = {
          total_amount: Math.round(totalAmount(cartItems) * 100),
          videogames: cartItems.map((item) => ({
            id: item.id,
            quantity: item.cartQuantity || 1,
          })),
          ...(discountId ? { discount_id: discountId } : {}),
        };

        // 1. Crea fattura
        const invoiceUrl = `${API_BASE}/invoices`;
        console.debug("[Checkout] POST", invoiceUrl, orderData);
        const invoiceRes = await fetch(invoiceUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, ...orderData }),
        });
        if (!invoiceRes.ok) throw new Error("Errore creazione fattura");
        const invoiceJson = await invoiceRes.json();
        const invoiceId = invoiceJson?.created_id;
        if (!invoiceId) throw new Error("ID fattura mancante");

        // 2. Crea indirizzo di fatturazione
        const billingAddressData = {
          full_name: formData.full_name,
          address_line: formData.address_line,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
        };
        const billingUrl = `${API_BASE}/billing-addresses`;
        console.debug("[Checkout] POST", billingUrl, billingAddressData);
        const billingRes = await fetch(billingUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(billingAddressData),
        });
        if (!billingRes.ok)
          throw new Error("Errore creazione indirizzo fatturazione");
        const billingJson = await billingRes.json();
        const billingAddressId = billingJson?.created_id;
        if (!billingAddressId)
          throw new Error("ID indirizzo fatturazione mancante");

        // 3. Invia email ordine
        try {
          const emailUrl = `${API_BASE}/emails/orders`;
          console.debug("[Checkout] POST", emailUrl);
          const emailRes = await fetch(emailUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              invoice_id: invoiceId,
              billing_address_id: billingAddressId,
            }),
          });
          if (!emailRes.ok) console.warn("Invio email fallito");
        } catch (emailErr) {
          console.warn("Errore invio email", emailErr);
        }

        localStorage.removeItem("videogames");
        setCartItems([]); // Svuota il carrello globale

        // Navigazione finale
        console.debug("[Checkout] Navigating to /thank-you");
        setOrderCompleted(true);
        navigate("/thank-you");
      } catch (error) {
        console.error("Errore durante l'invio del modulo:", error);
        setSubmissionError(error.message || "Errore durante l'invio");
        setIsSubmitting(false);
      }
    },
    [
      API_BASE,
      cartItems,
      discountId,
      formData,
      isSubmitting,
      setCartItems,
      navigate,
      totalAmount,
    ]
  );

  // Fallback nel caso navigate non abbia effetto (edge cases di StrictMode / transizioni)
  useEffect(() => {
    if (orderCompleted) {
      const timer = setTimeout(() => {
        if (window.location.pathname !== "/thank-you") {
          console.warn("[Checkout] Fallback redirect for /thank-you");
          window.location.href = "/thank-you";
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [orderCompleted]);

  const isFilled =
    formData.full_name &&
    formData.address_line &&
    formData.city &&
    formData.postal_code &&
    formData.country &&
    formData.email &&
    cartItems &&
    cartItems.length > 0;

  const handleDiscountCode = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const codeInput = e.target.value.trim();
    if (!codeInput) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/discounts/codes/${codeInput}`
      );
      const data = await res.json();
      if (!res.ok || !data || data.error)
        throw new Error("Codice sconto non valido");
      const now = new Date();
      const validFrom = new Date(data.valid_from);
      const expiresAt = new Date(data.expires_at);
      if (now < validFrom)
        return setDiscountStatus({
          message: "Codice non ancora valido",
          color: "orange",
        });
      if (now > expiresAt)
        return setDiscountStatus({ message: "Codice scaduto", color: "red" });
      setDiscountStatus({
        message: `Valido: -${data.discount_percentage}%`,
        color: "green",
      });
      e.target.value = "";
      setDiscountPercentage(data.discount_percentage);
      setDiscountId(data.id);
    } catch (err) {
      setDiscountStatus({
        message: err.message || "Codice non valido",
        color: "red",
      });
    }
  };

  return (
    <>
      <form className="container mt-5" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-xl-8 px-5">
            <h2 className="text-center mb-5">
              Inserisci i dati per la fatturazzione
            </h2>
            <div className="row">
              <div className="mb-3 col-12 col-md-4">
                <label htmlFor="fullname" className="form-label">
                  Nome completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  maxLength={255}
                  minLength={1}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div className="mb-3 col-12 col-md-4">
                <label htmlFor="address_line" className="form-label">
                  Indirizzo
                </label>
                <input
                  type="text"
                  minLength={1}
                  maxLength={255}
                  className="form-control"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div className="mb-3 col-12 col-md-4">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleFormData}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-12 col-md-4">
                <label htmlFor="city" className="form-label">
                  Città
                </label>
                <input
                  type="text"
                  maxLength={100}
                  minLength={1}
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div className="mb-3 col-12 col-md-4">
                <label htmlFor="postal_code" className="form-label">
                  Codice Postale
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="postal_code"
                  max={99999}
                  min={10000}
                  value={formData.postal_code}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div className="mb-3 col-12 col-md-4">
                <label htmlFor="countryInitials" className="form-label">
                  Iniziali paese
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleFormData}
                  maxLength={2}
                  minLength={2}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-4 border-secondary border-start px-5 border-xl-0 mt-5 mt-xl-0">
            <h2 className="text-center mb-5">Riepilogo</h2>
            <div className="d-flex flex-column gap-3">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center gap-3 border-bottom pb-3"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                      className="rounded"
                    />
                    <div className="flex-grow-1 text-start">
                      <h6 className="mb-1 text-white">{item.name}</h6>
                      <span className="text-secondary">
                        Quantità: {item.cartQuantity || 1}
                      </span>
                    </div>
                    <div>
                      {item.promo_price ? (
                        <>
                          <span className="h6 text-success me-2">
                            €{item.promo_price}
                          </span>
                          <span className="text-decoration-line-through text-secondary">
                            €{item.price}
                          </span>
                        </>
                      ) : (
                        <span className="h6 text-white">€{item.price}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Il carrello è vuoto</p>
              )}
              {cartItems && cartItems.length > 0 && (
                <>
                  <div className="mt-4">
                    <h5 className="fw-bold">Codice Sconto</h5>
                    <input
                      type="text"
                      className="form-control"
                      name="codice_sconto"
                      placeholder="Inserisci il codice"
                      onKeyDown={handleDiscountCode}
                      maxLength={20}
                      minLength={1}
                    />
                    <p
                      className="mt-1 mb-0 text-status-code"
                      style={{ color: discountStatus.color }}
                    >
                      {discountStatus.message}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <span className="fw-bold">Totale:</span>
                    <span className="fw-bold">€{totalAmount(cartItems)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          {submissionError && (
            <div
              className="alert alert-danger py-2 px-3 fw-semibold"
              role="alert"
            >
              {submissionError}
            </div>
          )}
          <button
            type="submit"
            disabled={!isFilled || isSubmitting}
            className={`${
              isFilled && !isSubmitting
                ? "btn-gradient fw-bold"
                : "empty-btn-gradient"
            } mx-auto my-5 col-6 col-lg-4`}
          >
            {isSubmitting ? "Invio..." : "Completa l'ordine"}
          </button>
        </div>
      </form>
    </>
  );
}
