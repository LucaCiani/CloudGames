import { useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";

export default function ProductAddToCartButton({ quantity, product }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSingleGamePage = location.pathname.startsWith("/videogames/");

  // Stato globale
  const { cartItems, setCartItems, handleAddToCart } =
    useContext(GlobalContext);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.cartQuantity || 1),
    0
  );

  const removeFromCart = (productId) => {
    const newCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(newCartItems);
    localStorage.setItem("videogames", JSON.stringify(newCartItems));
  };

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

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.promo_price || item.price || 0;
    const qty = item.cartQuantity || 1;
    return total + price * qty;
  }, 0);

  function hasReachedMaxQuantity(product) {
    if (!product) return false;
    const cartItem = cartItems.find((item) => item.id === product.id);
    if (!cartItem) return false;
    return cartItem.cartQuantity >= product.quantity;
  }

  return (
    <div>
      {isSingleGamePage && (
        <button
          className={`${
            !hasReachedMaxQuantity(product) && product.quantity > 0
              ? "btn-gradient"
              : "empty-btn-gradient"
          } w-100`}
          style={{ marginTop: "0px" }}
          disabled={quantity === 0 || hasReachedMaxQuantity(product)}
          onClick={() => handleAddToCart(1, product)}
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
        >
          {quantity > 0 ? "Aggiungi al carrello" : "Non disponibile"}
        </button>
      )}

      <div
        className="offcanvas offcanvas-end custom-cart"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel">Carrello ({totalQuantity})</h5>{" "}
          {/* badge aggiornato */}
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
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
                      <Link
                        to={`/videogames/${item.slug}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={
                            item.image_url || item.image || "/placeholder.jpg"
                          }
                          alt={item.name || item.title || "Prodotto"}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                          className="me-3 rounded"
                        />
                      </Link>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          {item.name || item.title || "Nome non disponibile"}
                        </h6>
                        <div className="mb-3">
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
                            disabled={item.cartQuantity >= (item.quantity || 1)}
                          >
                            +
                          </button>
                          <button
                            className="bi bi-trash btn btn-sm btn-danger ms-auto"
                            onClick={() => removeFromCart(item.id)}
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className=" pt-3 mt-3">
                <h5 className="text-center">
                  Totale: € {totalPrice.toFixed(2)}
                </h5>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn-gradient fw-bold"
                    onClick={() => navigate("/cart")}
                  >
                    Procedi al checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>Il carrello è vuoto.</p>
          )}
        </div>
      </div>
    </div>
  );
}
