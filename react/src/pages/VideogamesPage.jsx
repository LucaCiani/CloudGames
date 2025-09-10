import { useState, useEffect } from "react";
import useGlobalContext from "../contexts/useGlobalContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductAddToCartButton from "../components/Components_SinglePage/ProductAddToCartButton";

// Hook custom per leggere i parametri della query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VideogamesPage() {
  // Prendi i videogiochi dal context globale
  const { videogames } = useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();

  // Stati per ordinamento, filtro piattaforma, filtro scontati e vista (griglia/lista)
  const [sortOrder, setSortOrder] = useState(query.get("sort") || "az");
  const [platformFilter, setPlatformFilter] = useState(
    query.get("platform") || "all"
  );
  const [discountedOnly, setDiscountedOnly] = useState(
    query.get("discounted") === "true"
  );
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list"

  // Stato per la ricerca testuale
  const search = query.get("search")?.toLowerCase() || "";

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = useState(1); // Pagina corrente
  const resultsPerPage = 15; // Risultati per pagina

  // Aggiorna la query string nell'URL quando cambiano i filtri/ordinamento
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sortOrder && sortOrder !== "az") params.set("sort", sortOrder);
    if (platformFilter && platformFilter !== "all")
      params.set("platform", platformFilter);
    if (discountedOnly) params.set("discounted", "true");
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
    // eslint-disable-next-line
  }, [sortOrder, platformFilter, discountedOnly, search]);

  // Ottieni tutte le piattaforme disponibili dai videogiochi
  const allPlatforms = Array.from(
    new Set(
      (videogames || []).flatMap((vg) => vg.platforms || []).filter(Boolean)
    )
  );

  // Filtra i giochi in base alla ricerca
  let filteredGames = search
    ? videogames?.filter((vg) => vg.name.toLowerCase().includes(search))
    : videogames;

  // Filtra per piattaforma selezionata
  if (platformFilter !== "all") {
    filteredGames = filteredGames?.filter((vg) =>
      (vg.platforms || []).includes(platformFilter)
    );
  }

  // Filtra solo i giochi scontati se richiesto
  if (discountedOnly) {
    filteredGames = filteredGames?.filter(
      (vg) =>
        vg.promo_price !== null &&
        vg.promo_price !== undefined &&
        vg.promo_price !== "" &&
        Number(vg.promo_price) < Number(vg.price)
    );
  }

  // Ordina i giochi in base all'ordinamento selezionato
  if (filteredGames) {
    filteredGames = [...filteredGames].sort((a, b) => {
      if (sortOrder === "az") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "za") {
        return b.name.localeCompare(a.name);
      } else if (sortOrder === "price-asc") {
        const priceA = a.promo_price ?? a.price;
        const priceB = b.promo_price ?? b.price;
        return priceA - priceB;
      } else if (sortOrder === "price-desc") {
        const priceA = a.promo_price ?? a.price;
        const priceB = b.promo_price ?? b.price;
        return priceB - priceA;
      }
      return 0;
    });
  }

  // Calcola gli indici per la paginazione
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = currentPage * resultsPerPage;

  // Filtra i giochi per la pagina corrente
  const paginatedGames = filteredGames?.slice(startIndex, endIndex);

  // Calcola il numero totale di pagine
  const totalPages = Math.ceil((filteredGames?.length || 0) / resultsPerPage);

  // Funzioni per cambiare la pagina
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="container my-5">
        {/* Mostra la ricerca corrente se presente */}
        {search && (
          <p className="text-white mb-4">
            Risultati per:{" "}
            <span className="fw-bold">{query.get("search")}</span>
          </p>
        )}

        {/* Barra dei filtri e dei bottoni */}
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          {/* Dropdown ordinamento */}
          <div className="dropdown me-2">
            <button
              className="btn btn-sm btn-gradient dropdown-toggle"
              type="button"
              id="sortDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Ordina
            </button>
            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
              <li>
                <button
                  className={`dropdown-item${
                    sortOrder === "az" ? " active" : ""
                  }`}
                  onClick={() => setSortOrder("az")}
                >
                  A-Z
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item${
                    sortOrder === "za" ? " active" : ""
                  }`}
                  onClick={() => setSortOrder("za")}
                >
                  Z-A
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item${
                    sortOrder === "price-asc" ? " active" : ""
                  }`}
                  onClick={() => setSortOrder("price-asc")}
                >
                  Prezzo crescente
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item${
                    sortOrder === "price-desc" ? " active" : ""
                  }`}
                  onClick={() => setSortOrder("price-desc")}
                >
                  Prezzo decrescente
                </button>
              </li>
            </ul>
          </div>

          {/* Dropdown piattaforme */}
          <div className="dropdown me-2">
            <button
              className=" btn-gradient dropdown-toggle"
              type="button"
              id="filterDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {platformFilter === "all"
                ? "Tutte le piattaforme"
                : platformFilter}
            </button>
            <ul className="dropdown-menu" aria-labelledby="filterDropdown">
              <li>
                <button
                  className={`dropdown-item${
                    platformFilter === "all" ? " active" : ""
                  }`}
                  onClick={() => setPlatformFilter("all")}
                >
                  Tutte le piattaforme
                </button>
              </li>
              {allPlatforms.map((platform) => (
                <li key={platform}>
                  <button
                    className={`dropdown-item${
                      platformFilter === platform ? " active" : ""
                    }`}
                    onClick={() => setPlatformFilter(platform)}
                  >
                    {platform}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottone per mostrare solo giochi scontati */}
          <button
            className={`btn-gradient ${
              discountedOnly ? "" : "discounted-only"
            }`}
            onClick={() => setDiscountedOnly((prev) => !prev)}
          >
            Solo scontati
          </button>

          {/* Bottone per cambiare vista griglia/lista */}
          <button
            className="btn-gradient ms-auto"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <i
              className={`fa-solid ${
                viewMode === "grid" ? "fa-list" : "fa-grip"
              }`}
            ></i>
            {viewMode === "grid" ? " Lista" : " Griglia"}
          </button>
        </div>

        {/* VISTA GRIGLIA: mostra le card dei videogiochi */}
        {viewMode === "grid" && (
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-xl-3 g-5">
            {paginatedGames &&
              paginatedGames.map((videogame) => {
                return (
                  <div key={videogame.id} className="col">
                    <Link
                      to={`/videogames/${videogame.slug}`}
                      className="text-decoration-none"
                    >
                      <div className="card border-0 h-100 list-card-hover">
                        <img
                          src={videogame.image_url}
                          alt={videogame.name}
                          className="card-img-top rounded"
                          style={{
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                          <span className="fw-bold text-truncate text-white">
                            {videogame.name}
                          </span>
                          <span>
                            {videogame.promo_price ? (
                              <>
                                <span className="text-success fw-bold">
                                  €{videogame.promo_price}
                                </span>{" "}
                                <span className="text-decoration-line-through text-secondary">
                                  €{videogame.price}
                                </span>
                              </>
                            ) : (
                              <>€{videogame.price}</>
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        )}

        {/* VISTA LISTA: mostra i videogiochi in formato lista */}
        {viewMode === "list" && (
          <div className="list-group">
            {paginatedGames &&
              paginatedGames.map((videogame) => {
                return (
                  <Link
                    key={videogame.id}
                    to={`/videogames/${videogame.slug}`}
                    className="list-group-item list-group-item-action border-0 bg-dark text-white mb-2 rounded list-card-hover"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={videogame.image_url}
                        alt={videogame.name}
                        className="rounded me-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-white">{videogame.name}</h6>

                        {/* Sezione dei Generi */}
                        <div className="mb-2">
                          <div
                            className="d-flex gap-2 flex-wrap"
                            style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                          >
                            {videogame.genres && videogame.genres.length > 0
                              ? videogame.genres.map((genre, index) => (
                                  <span
                                    key={index}
                                    className={`badge genre-${genre.toLowerCase()}`}
                                    style={{
                                      display: "inline-block",
                                      whiteSpace: "nowrap",
                                      fontSize: "0.65rem",
                                      padding: "0.3rem 0.6rem",
                                    }}
                                  >
                                    {genre}
                                  </span>
                                ))
                              : "N/A"}
                          </div>
                        </div>

                        {/* Sezione del Voto */}
                        <div className="mb-2">
                          <span className="me-2">
                            ⭐{" "}
                            {videogame.vote
                              ? parseFloat(videogame.vote).toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="text-end">
                        {videogame.promo_price ? (
                          <>
                            <div className="text-success fw-bold fs-5">
                              €{videogame.promo_price}
                            </div>
                            <div className="text-decoration-line-through text-secondary small">
                              €{videogame.price}
                            </div>
                          </>
                        ) : (
                          <div className="text-white fw-bold fs-5">
                            €{videogame.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}

        {/* Messaggio se nessun gioco trovato */}
        {filteredGames?.length === 0 && (
          <div className="text-center text-white mt-5">
            Nessun risultato trovato.
          </div>
        )}

        {/* Controlli della paginazione */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          {/* Bottone Precedente */}
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {/* Pagine numeriche */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            // Calcoliamo il range di pagine da visualizzare
            const start = Math.max(currentPage - 2, 1); // 2 pagine prima della corrente
            const end = Math.min(currentPage + 2, totalPages); // 2 pagine dopo la corrente

            // Verifica se la pagina è dentro il range da visualizzare
            if (page < start || page > end) {
              return null; // Non renderizzare la pagina se non è nel range
            }

            return (
              <button
                key={page}
                className={`btn btn-sm ${
                  page === currentPage
                    ? "btn-warning text-white"
                    : "btn-outline-warning"
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}

          {/* Bottone Successivo */}
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
      <ProductAddToCartButton />
    </>
  );
}
