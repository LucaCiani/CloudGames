import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Carica il carrello dal localStorage all’avvio
  useEffect(() => {
    const savedCart = localStorage.getItem("videogames");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const validItems = parsedCart.filter(
          (item) => item !== null && item !== undefined
        );
        setCartItems(validItems);
      } catch (error) {
        console.error("Errore nel parsing del localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Rimuove un prodotto dal carrello
  const removeFromCart = (productId) => {
    const newCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(newCartItems);
    localStorage.setItem("videogames", JSON.stringify(newCartItems));
  };

  // Aggiorna la quantità di un prodotto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, cartQuantity: newQuantity } : item
    );
    setCartItems(newCartItems);
    localStorage.setItem("videogames", JSON.stringify(newCartItems));
  };

  // Totale del carrello
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.promo_price || item.price || 0;
    const qty = item.cartQuantity || 1;
    return total + price * qty;
  }, 0);

  if (!cartItems.length) {
    return (
      <div className="container my-5 text-center">
        <h2>Il carrello è vuoto</h2>
        <Link to="/" className="btn-gradient mt-3">
          Torna allo shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Il tuo carrello</h2>

      {cartItems.map((item, index) => {
        if (!item) return null;

        return (
          <div key={item.id || index} className="mb-3 border-bottom pb-2">
            <div className="d-flex align-items-center">
              <img
                src={item.image_url || item.image || "/placeholder.jpg"}
                alt={item.name || "Prodotto"}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
                className="me-3 rounded"
              />
              <div className="flex-grow-1">
                <h5 className="mb-1 text-white">{item.name}</h5>
                <p className="mb-1 text-success fw-bold">
                  € {item.promo_price || item.price || "0.00"}
                </p>
                <div className="d-flex align-items-center gap-2">
                  {/* Tasti quantità */}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      updateQuantity(item.id, (item.cartQuantity || 1) - 1)
                    }
                  >
                    -
                  </button>
                  <span>
                    <strong>quantità: </strong>
                    {item.cartQuantity || 1}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      updateQuantity(item.id, (item.cartQuantity || 1) + 1)
                    }
                  >
                    +
                  </button>
                  {/* Cestino */}
                  <button
                    className="btn btn-sm btn-danger ms-auto"
                    onClick={() => removeFromCart(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-4 text-center">
        <h4>Totale: € {totalPrice.toFixed(2)}</h4>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            className="btn-gradient"
            onClick={() => navigate("/checkout")}
          >
            Procedi al checkout
          </button>
          <Link to="/" className="btn-gradient">
            Torna allo shop
          </Link>
        </div>
      </div>
    </div>
  );
}
