import React, { useState, useEffect } from "react";

export default function ProductAddToCartButton({
  quantity,
  onAddToCart,
  product,
}) {
  // Stato locale per gli articoli nel carrello
  const [cartItems, setCartItems] = useState([]);

  // All'avvio, carica il carrello dal localStorage (persistenza locale)
  useEffect(() => {
    const savedCart = localStorage.getItem("videogames");
    if (savedCart) {
      try {
        // Parsing del carrello e filtro di eventuali elementi null/undefined
        const parsedCart = JSON.parse(savedCart);
        const validItems = parsedCart.filter(
          (item) => item !== null && item !== undefined
        );
        setCartItems(validItems);
      } catch (error) {
        // Gestione errori di parsing
        console.error("Errore nel parsing del localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Funzione chiamata al click su "Aggiungi al carrello"
  const handleAddToCart = () => {
    if (quantity === 0) return; // Non aggiungere se non disponibile
    if (!product) return; // Non aggiungere se manca il prodotto

    // Controlla se il prodotto è già presente nel carrello
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    let newCartItems;

    if (existingItemIndex > -1) {
      // Se già presente, aumenta la quantità
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        cartQuantity: (newCartItems[existingItemIndex].cartQuantity || 1) + 1,
      };
    } else {
      // Se non presente, aggiungilo con quantità 1
      const productWithQuantity = {
        ...product,
        cartQuantity: 1,
      };
      newCartItems = [...cartItems, productWithQuantity];
    }

    // Aggiorna stato e localStorage
    setCartItems(newCartItems);
    localStorage.setItem("videogames", JSON.stringify(newCartItems));

    // Callback opzionale
    if (onAddToCart) onAddToCart();

    // Debug
    console.log("Prodotto aggiunto:", product);
    console.log("Carrello aggiornato:", newCartItems);
  };
  // Calcola la quantità totale di tutti i prodotti nel carrello
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.cartQuantity || 1),
    0
  );
  // Rimuove un prodotto dal carrello
  const removeFromCart = (productId) => {
    const newCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(newCartItems);
    localStorage.setItem("videogames", JSON.stringify(newCartItems));
  };

  // Modifica la quantità di un prodotto nel carrello
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Se la quantità è zero o meno, rimuovi il prodotto
      removeFromCart(productId);
      return;
    }

    // Aggiorna la quantità del prodotto selezionato
    const newCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, cartQuantity: newQuantity } : item
    );
    setCartItems(newCartItems);
    localStorage.setItem("videogames", JSON.stringify(newCartItems));
  };

  // Calcola il totale del carrello (considerando eventuale prezzo promozionale)
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.promo_price || item.price || 0;
    const qty = item.cartQuantity || 1;
    return  total + price * qty;
  }, 0);

  return (
    <div>
      {/* Bottone per aggiungere al carrello e aprire l'offcanvas */}
      <button
        className="btn-gradient w-100"
        disabled={quantity === 0}
        onClick={handleAddToCart}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        {quantity > 0 ? "Aggiungi al carrello" : "Non disponibile"}
      </button>

      {/* Offcanvas Bootstrap per mostrare il carrello */}
      <div
        className="offcanvas offcanvas-end custom-cart"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          {/* Titolo e pulsante di chiusura */}
          <h5 id="offcanvasRightLabel">Carrello ({totalQuantity})</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* Se il carrello ha prodotti, li mostra */}
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item, index) => {
                if (!item) return null;

                return (
                  <div
                    key={item.id || index}
                    className="mb-3 border-bottom pb-2"
                  >
                    <div className="d-flex">
                      {/* Immagine prodotto */}
                      <img
                        src={item.image_url || item.image || "/placeholder.jpg"}
                        alt={item.name || item.title || "Prodotto"}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        {/* Nome e prezzo */}
                        <h6 className="mb-1">
                          {item.name || item.title || "Nome non disponibile"}
                        </h6>
                        <p className="mb-1 text-success fw-bold">
                          € {item.promo_price || item.price || "0.00"}
                        </p>
                        {/* Gestione quantità e rimozione */}
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                (item.cartQuantity || 1) - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="me-2">
                            <strong>quantità : </strong>
                            {item.cartQuantity || 1}
                          </span>
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                (item.cartQuantity || 1) + 1
                              )
                            }
                          >
                            +
                          </button>
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
              {/* Totale e pulsante checkout */}
              <div className=" pt-3 mt-3">
                <h5>Totale: € {totalPrice.toFixed(2)}</h5>
                <button className="btn btn-success w-100">
                  Procedi al checkout
                </button>
              </div>
            </>
          ) : (
            // Messaggio se il carrello è vuoto
            <p>Il carrello è vuoto.</p>
          )}
        </div>
      </div>
    </div>
  );
}
