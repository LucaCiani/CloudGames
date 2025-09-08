export default function ProductDetails({
  description, // Descrizione del prodotto
  release_date, // Data di rilascio del prodotto
  quantity, // Quantità disponibile
}) {
  return (
    <>
      {/* Mostra la descrizione del prodotto */}
      <p className="mb-4">{description}</p>

      {/* Sezione data di rilascio */}
      <div className="mb-4">
        <h6>Data di rilascio:</h6>
        {/* Converte la data in formato italiano */}
        <span>{new Date(release_date).toLocaleDateString("it-IT")}</span>
      </div>

      {/* Sezione quantità disponibile */}
      <div className="mb-4">
        <span className="text-success">
          {/* Mostra la quantità se > 0, altrimenti "Non disponibile" */}
          {quantity > 0 ? `${quantity} disponibili` : "Non disponibile"}
        </span>
      </div>
    </>
  );
}
