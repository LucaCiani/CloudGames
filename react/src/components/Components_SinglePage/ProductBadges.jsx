export default function ProductBadges({ platforms, genres }) {
  return (
    <>
      {/* Sezione piattaforme */}
      <div className="mb-3">
        <h6>Piattaforme:</h6>
        <div className="d-flex gap-2">
          {/* Cicla su tutte le piattaforme e mostra un badge per ognuna */}
          {platforms.map((platform, index) => (
            <span
              key={index}
              className={`badge platform-${platform.toLowerCase()}`}
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Sezione generi */}
      <div className="mb-3">
        <h6>Generi:</h6>
        <div className="d-flex gap-2">
          {/* Cicla su tutti i generi e mostra un badge per ognuno */}
          {genres.map((genre, index) => (
            <span key={index} className={`badge genre-${genre.toLowerCase()}`}>
              {genre}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
