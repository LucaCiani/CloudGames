import { useState, useEffect, useRef } from "react";
import useGlobalContext from "../contexts/useGlobalContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductAddToCartButton from "../components/Components_SinglePage/ProductAddToCartButton";
import ChatBot from "../components/ChatBot";
// Hook custom per leggere i parametri della query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VideogamesPage() {
  // Prendi i videogiochi dal context globale
  const { videogames, handleAddToCart, cartItems } = useGlobalContext();
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
  const [viewMode, setViewMode] = useState(query.get("view") || "grid"); // "grid" o "list"

  const [genreFilter, setGenreFilter] = useState(query.get("genre") || "all");

  // Stato per la ricerca testuale
  const search = query.get("search")?.toLowerCase() || "";

  // Stato per la paginazione
  const [currentPage, setCurrentPage] = useState(
    parseInt(query.get("page")) || 1
  ); // Pagina corrente
  const [resultsPerPage, setResultsPerPage] = useState(
    query.get("results") || 15
  ); // Risultati per pagina

  // Ref per gestire mount iniziale e confronto filtri precedenti
  const initialMountRef = useRef(true);
  const prevFiltersRef = useRef({
    sortOrder,
    platformFilter,
    genreFilter,
    discountedOnly,
    resultsPerPage,
    search,
  });

  // Reset della pagina a 1 SOLO quando cambiano i filtri dopo il primo mount (escludiamo viewMode apposta).
  // Evita che un link /videogames?page=3 venga sovrascritto all'avvio.
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
    } else {
      const prev = prevFiltersRef.current;
      const filtersChanged =
        prev.sortOrder !== sortOrder ||
        prev.platformFilter !== platformFilter ||
        prev.genreFilter !== genreFilter ||
        prev.discountedOnly !== discountedOnly ||
        prev.resultsPerPage !== resultsPerPage ||
        prev.search !== search; // includiamo anche la ricerca come filtro logico
      if (filtersChanged && currentPage !== 1) {
        setCurrentPage(1);
      }
    }
    prevFiltersRef.current = {
      sortOrder,
      platformFilter,
      genreFilter,
      discountedOnly,
      resultsPerPage,
      search,
    };
  }, [
    sortOrder,
    platformFilter,
    genreFilter,
    discountedOnly,
    resultsPerPage,
    search,
    currentPage,
  ]);

  // Aggiorna la query string nell'URL quando cambiano i filtri/ordinamento
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sortOrder && sortOrder !== "az") params.set("sort", sortOrder);
    if (platformFilter && platformFilter !== "all")
      params.set("platform", platformFilter);
    if (genreFilter && genreFilter !== "all") params.set("genre", genreFilter);
    if (discountedOnly) params.set("discounted", "true");
    if (resultsPerPage && resultsPerPage !== 15)
      params.set("results", resultsPerPage);
    if (viewMode && viewMode !== "grid") params.set("view", viewMode);
    if (currentPage && currentPage !== 1) params.set("page", currentPage);

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  }, [
    currentPage,
    discountedOnly,
    genreFilter,
    location.pathname,
    navigate,
    platformFilter,
    resultsPerPage,
    search,
    sortOrder,
    viewMode,
  ]);

  // Ottieni tutte le piattaforme disponibili dai videogiochi
  const allPlatforms = Array.from(
    new Set(
      (videogames || []).flatMap((vg) => vg.platforms || []).filter(Boolean)
    )
  );

  const allGenre = Array.from(
    new Set((videogames || []).flatMap((vg) => vg.genres || []).filter(Boolean))
  );

  // Filtra i giochi in base alla ricerca
  let filteredGames = search
    ? videogames?.filter((vg) => {
        const gameName = vg.name.toLowerCase();
        // Split search query into individual words and check if all words are present in the game name
        const searchWords = search
          .split(/\s+/)
          .filter((word) => word.length > 0);
        return searchWords.every((word) => gameName.includes(word));
      })
    : videogames;

  // Filtra per piattaforma selezionata
  if (platformFilter !== "all") {
    filteredGames = filteredGames?.filter((vg) =>
      (vg.platforms || []).includes(platformFilter)
    );
  }

  if (genreFilter !== "all") {
    filteredGames = filteredGames?.filter((vg) =>
      (vg.genres || []).includes(genreFilter)
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

  const truncate = (text, max = 150) => {
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "...";
  };

  function hasReachedMaxQuantity(product) {
    if (!product) return false;
    const cartItem = cartItems.find((item) => item.id === product.id);
    if (!cartItem) return false;
    return cartItem.cartQuantity >= product.quantity;
  }

  return (
    <>
      {/* Contenuto pagina */}
      <div className="container my-5 mb-4 px-3">
        {/* Sezione ricerca */}
        <div className="d-flex gap-4 flex-wrap">
          {/* Mostra la ricerca corrente se presente */}
          {search && filteredGames?.length > 0 && (
            <div className="row mb-3">
              <div className="col-12">
                <p className="text-white">
                  <span className="fw-bold">{filteredGames?.length}</span>{" "}
                  risultat
                  {filteredGames?.length === 1 ? "o" : "i"} per:{" "}
                  <span className="fw-bold">{query?.get("search")}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sezione filtri e bottoni */}
        <div className="row mb-3">
          {/* Sezione sinistra (generi, piattaforme, ordina, in sconto) */}
          <div className="col-12 col-xl-8 d-flex gap-4 justify-content-between justify-content-xl-start flex-column flex-md-row">
            {/* generi  */}
            <div className="dropdown">
              <button
                className="btn-gradient btn-sm dropdown-toggle w-100"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {genreFilter === "all" ? "generi" : genreFilter}
              </button>
              <ul
                className="dropdown-menu w-100"
                aria-labelledby="filterDropdown"
              >
                <li>
                  <button
                    className={`dropdown-item${
                      genreFilter === "all" ? " active" : ""
                    }`}
                    onClick={() => setGenreFilter("all")}
                  >
                    Tutti i generi
                  </button>
                </li>
                {allGenre.map((genre) => (
                  <li key={genre}>
                    <button
                      className={`dropdown-item${
                        genreFilter === genre ? " active" : ""
                      }`}
                      onClick={() => setGenreFilter(genre)}
                    >
                      {genre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* piattaforme */}
            <div className="dropdown">
              <button
                className="btn-gradient btn-sm dropdown-toggle w-100"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {platformFilter === "all" ? "piattaforme" : platformFilter}
              </button>
              <ul
                className="dropdown-menu w-100"
                aria-labelledby="filterDropdown"
              >
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

            {/* ordina */}
            <div className="dropdown">
              <button
                className="btn-sm btn-gradient dropdown-toggle w-100"
                type="button"
                id="sortDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ordina
              </button>
              <ul
                className="dropdown-menu w-100"
                aria-labelledby="sortDropdown"
              >
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
                    Prezzo più basso
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item${
                      sortOrder === "price-desc" ? " active" : ""
                    }`}
                    onClick={() => setSortOrder("price-desc")}
                  >
                    Prezzo più alto
                  </button>
                </li>
              </ul>
            </div>

            {/* in sconto */}
            <div className="dropdown mb-4 mb-md-0">
              <button
                className={`${
                  discountedOnly ? "btn-gradient" : "empty-btn-gradient"
                } btn-sm w-100`}
                onClick={() => setDiscountedOnly((prev) => !prev)}
              >
                In sconto
              </button>
            </div>
          </div>

          {/* Sezione destra (vista griglia/lista), n. risultati */}
          <div className="col-12 col-xl-4 d-flex gap-4 justify-content-between justify-content-xl-end flex-column flex-md-row">
            {/* N. risultati */}
            <div className="dropdown">
              <button
                className="btn-gradient btn-sm dropdown-toggle w-100"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                N. risultati
              </button>
              <ul
                className="dropdown-menu w-100"
                aria-labelledby="filterDropdown"
              >
                <li>
                  <button
                    className={`dropdown-item${
                      resultsPerPage === 15 ? " active" : ""
                    }`}
                    onClick={() => setResultsPerPage(15)}
                  >
                    15 videogame
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item${
                      resultsPerPage === 24 ? " active" : ""
                    }`}
                    onClick={() => setResultsPerPage(24)}
                  >
                    24 videogame
                  </button>
                </li>
              </ul>
            </div>
            {/* Vista griglia/lista */}
            <div>
              <button
                className="btn-gradient btn-sm w-100"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                <i
                  className={`fa-solid ${
                    viewMode === "grid" ? "fa-list" : "fa-grip"
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* VISTA GRIGLIA: mostra i videogiochi in formato griglia */}
        {viewMode === "grid" &&
          (paginatedGames && paginatedGames.length > 0 ? (
            <div className="row g-4">
              {paginatedGames.map((videogame) => {
                return (
                  <div key={videogame.id} className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 h-100 position-relative">
                      {/* Link with image and badge container */}
                      <Link
                        to={`/videogames/${videogame.slug}`}
                        className="position-relative list-card-hover"
                      >
                        {/* Badge "In sconto" */}
                        {videogame.promo_price && (
                          <span
                            className="badge bg-success position-absolute"
                            style={{
                              top: "10px",
                              left: "10px",
                              zIndex: 2,
                              pointerEvents: "none",
                            }}
                          >
                            In sconto
                          </span>
                        )}
                        <img
                          src={videogame.image_url}
                          alt={videogame.name}
                          className="card-img-top rounded"
                          style={{
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                      <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                        {/* Nome come link */}
                        <Link
                          to={`/videogames/${videogame.slug}`}
                          className="fw-bold text-truncate text-white text-decoration-none game-name flex-grow-1"
                        >
                          {videogame.name}
                        </Link>
                        <div className="d-flex align-items-center gap-2">
                          <span>
                            {videogame.promo_price ? (
                              <span className="text-nowrap">
                                <span className="text-success fw-bold">
                                  €{videogame.promo_price}
                                </span>{" "}
                                <span className="text-decoration-line-through text-secondary">
                                  €{videogame.price}
                                </span>
                              </span>
                            ) : (
                              <>€{videogame.price}</>
                            )}
                          </span>
                          <button
                            className={`btn btn-sm ${
                              hasReachedMaxQuantity(videogame)
                                ? "btn-secondary"
                                : "btn-warning"
                            }`}
                            style={{ fontSize: "1rem" }}
                            onClick={() => handleAddToCart(1, videogame)}
                            disabled={hasReachedMaxQuantity(videogame)}
                          >
                            <i className="bi bi-cart-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-white my-5">
              Nessun risultato trovato.
            </div>
          ))}

        {/* VISTA LISTA: mostra i videogiochi in formato lista */}
        {viewMode === "list" &&
          (paginatedGames && paginatedGames.length > 0 ? (
            <div className="list-group">
              {paginatedGames.map((videogame) => {
                return (
                  <div
                    key={videogame.id}
                    className="list-group-item list-group-item-action border-0 bg-dark text-white mb-2 rounded list-card-hover d-flex align-items-center"
                  >
                    <Link
                      to={`/videogames/${videogame.slug}`}
                      className="d-flex align-items-center flex-grow-1 text-decoration-none text-white"
                    >
                      <img
                        src={videogame.image_url}
                        alt={videogame.name}
                        className="rounded me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="me-3 text-list-group-title">
                        <h6 className="mb-1 text-white text-truncate">
                          {videogame.name}
                        </h6>
                        {/* Sezione dei Generi */}
                        <div className="mb-1">
                          <div className="d-flex gap-1 flex-wrap">
                            {videogame.genres && videogame.genres.length > 0
                              ? videogame.genres
                                  .slice(0, 2)
                                  .map((genre, index) => (
                                    <span
                                      key={index}
                                      className={`badge genre-${genre.toLowerCase()}`}
                                      style={{
                                        fontSize: "0.6rem",
                                        padding: "0.2rem 0.4rem",
                                      }}
                                    >
                                      {genre}
                                    </span>
                                  ))
                              : "N/A"}
                          </div>
                        </div>
                        <div className="small">
                          <span className="vote-star">
                            <img src="/star.png" alt="Stella" />
                            {videogame.vote
                              ? parseFloat(videogame.vote).toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="m-auto text-list-group-description">
                        <div className="small text-secondary">
                          {videogame.description &&
                            truncate(videogame.description, 100)}
                        </div>
                      </div>
                    </Link>
                    {/* Bottone separato dal Link */}
                    <button
                      className={`btn btn-sm ms-2 ${
                        hasReachedMaxQuantity(videogame)
                          ? "btn-secondary"
                          : "btn-warning"
                      }`}
                      style={{ fontSize: "1rem" }}
                      onClick={() => handleAddToCart(1, videogame)}
                      disabled={hasReachedMaxQuantity(videogame)}
                    >
                      <i className="bi bi-cart-plus"></i>
                    </button>
                    <div className="text-end ms-2" style={{ minWidth: "80px" }}>
                      {videogame.promo_price ? (
                        <>
                          <div className="text-success fw-bold">
                            €{videogame.promo_price}
                          </div>
                          <div className="text-decoration-line-through text-secondary small">
                            €{videogame.price}
                          </div>
                        </>
                      ) : (
                        <div className="text-white fw-bold">
                          €{videogame.price}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-white my-5">
              Nessun risultato trovato.
            </div>
          ))}
      </div>

      {/* Controlli della paginazione */}
      {filteredGames?.length > 0 && (
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
                  page === parseInt(currentPage)
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
      )}
      <ProductAddToCartButton />
      <ChatBot />
    </>
  );
}
