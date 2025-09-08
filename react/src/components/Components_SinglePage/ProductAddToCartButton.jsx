// Questo componente mostra un bottone "Aggiungi al carrello".
// Se la quantità è zero, il bottone è disabilitato e mostra "Non disponibile".
// Quando cliccato, chiama la funzione onAddToCart passata come prop.

export default function ProductAddToCartButton({ quantity, onAddToCart }) {
  return (
    <button
      className="btn-gradient w-100"
      disabled={quantity === 0}
      onClick={onAddToCart}
    >
      {quantity > 0 ? "Aggiungi al carrello" : "Non disponibile"}
    </button>
  );
}
