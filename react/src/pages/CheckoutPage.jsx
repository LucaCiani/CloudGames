import { useState, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
    email: "",
  });

  const [showDetails, setShowDetails] = useState(false);
  const { cartItems } = useContext(GlobalContext);

  const handleFormData = (e) => {
    e.preventDefault();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const button = e.target.querySelector("button[type='submit']");
    if (button) {
      button.disabled = true;
      button.innerHTML = "Invio...";
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE;

    try {
      const res = await fetch(`${apiBaseUrl}/billing-addresses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log("dati inviati");
        setShowDetails(true);
      } else {
        console.error("errore durante l'invio dei dati");
      }
    } catch (error) {
      console.error("si è verificato un problema", error);
    }
  };

  const isFilled =
    formData.full_name &&
    formData.address_line &&
    formData.city &&
    formData.postal_code &&
    formData.country &&
    formData.email &&
    cartItems &&
    cartItems.length > 0;

  return (
    <>
      <form className="container mt-5" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-lg-8 px-5">
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
          <div className="col-4 border-secondary border-start px-5 d-none d-lg-block">
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
                      <h6 className="mb-1 text-white">
                        {item.name || item.title || "Nome non disponibile"}
                      </h6>
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
              <div className="d-flex justify-content-between mt-4">
                <span className="fw-bold">Totale:</span>
                <span className="fw-bold">
                  €
                  {cartItems
                    ? cartItems
                        .reduce((total, item) => {
                          const price = item.promo_price || item.price || 0;
                          const qty = item.cartQuantity || 1;
                          return total + price * qty;
                        }, 0)
                        .toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={!isFilled}
            className={`${
              isFilled ? "btn-gradient fw-bold" : "empty-btn-gradient"
            } mx-auto my-5 col-6 col-lg-4`}
          >
            Completa l'ordine
          </button>
        </div>
      </form>

      {showDetails && (
        <div className="card container ">
          <div className="row row-cols-1 justify-content-center">
            <div className="col col-md-6 col-lg-5">
              <h5 className="card-title text-center">Riepilogo Dati</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item py-4 ">
                  <b>Nome completo</b>: {formData.full_name}
                </li>
                <li className="list-group-item py-4 ">
                  <b>Indirizzo</b>: {formData.address_line}
                </li>
                <li>
                  <li className="list-group-item py-4 ">
                    <b>E-mail</b>: {formData.email}
                  </li>
                </li>
                <li className="list-group-item py-4">
                  <b>Città</b>: {formData.city}
                </li>
                <li className="list-group-item py-4 ">
                  <b>Codice Postale</b>: {formData.postal_code}
                </li>
                <li className="list-group-item py-4 ">
                  <b>Paese</b>: {formData.country}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
