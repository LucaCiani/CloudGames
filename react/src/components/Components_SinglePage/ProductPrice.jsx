export default function ProductPrice({ price, promo_price }) {
  return (
    <div className="mb-3">
      {promo_price ? (
        <>
          <span className="h3 text-success me-2">
            €{promo_price}
          </span>
          <span className="text-decoration-line-through text-secondary">
            €{price}
          </span>
        </>
      ) : (
        <span className="h3">€{price}</span>
      )}
    </div>
  );
}