import { useState, useEffect } from "react";
import useGlobalContext from "../contexts/useGlobalContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductAddToCartButton from "../components/Components_SinglePage/ProductAddToCartButton";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function VideogamesPage() {
    const { videogames } = useGlobalContext();
    const location = useLocation();
    const navigate = useNavigate();
    const query = useQuery();

    // Stati per ordinamento e filtri separati, inizializzati da query string
    const [sortOrder, setSortOrder] = useState(query.get("sort") || "az");
    const [platformFilter, setPlatformFilter] = useState(
        query.get("platform") || "all"
    );
    const [discountedOnly, setDiscountedOnly] = useState(
        query.get("discounted") === "true"
    );
    const search = query.get("search")?.toLowerCase() || "";

    // Aggiorna la query string quando cambiano i filtri/ordinamento
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

    // Ottieni tutte le piattaforme disponibili
    const allPlatforms = Array.from(
        new Set(
            (videogames || [])
                .flatMap((vg) => vg.platforms || [])
                .filter(Boolean)
        )
    );

    let filteredGames = search
        ? videogames?.filter((vg) => vg.name.toLowerCase().includes(search))
        : videogames;

    // Filtra per piattaforma
    if (platformFilter !== "all") {
        filteredGames = filteredGames?.filter((vg) =>
            (vg.platforms || []).includes(platformFilter)
        );
    }

    // Filtra per scontati
    if (discountedOnly) {
        filteredGames = filteredGames?.filter(
            (vg) =>
                vg.promo_price !== null &&
                vg.promo_price !== undefined &&
                vg.promo_price !== "" &&
                Number(vg.promo_price) < Number(vg.price)
        );
    }

    // Ordina i giochi
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

    return (
        <>
            <div className="container my-5">
                {search && (
                    <p className="text-white mb-4">
                        Risultati per:{" "}
                        <span className="fw-bold">{query.get("search")}</span>
                    </p>
                )}
                <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
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
                        <ul
                            className="dropdown-menu"
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
                                        sortOrder === "price-asc"
                                            ? " active"
                                            : ""
                                    }`}
                                    onClick={() => setSortOrder("price-asc")}
                                >
                                    Prezzo crescente
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`dropdown-item${
                                        sortOrder === "price-desc"
                                            ? " active"
                                            : ""
                                    }`}
                                    onClick={() => setSortOrder("price-desc")}
                                >
                                    Prezzo decrescente
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown me-2">
                        <button
                            className="btn btn-sm btn-gradient dropdown-toggle"
                            type="button"
                            id="filterDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {platformFilter === "all"
                                ? "Tutte le piattaforme"
                                : platformFilter}
                        </button>
                        <ul
                            className="dropdown-menu"
                            aria-labelledby="filterDropdown"
                        >
                            <li>
                                <button
                                    className={`dropdown-item${
                                        platformFilter === "all"
                                            ? " active"
                                            : ""
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
                                            platformFilter === platform
                                                ? " active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setPlatformFilter(platform)
                                        }
                                    >
                                        {platform}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        className={`btn btn-sm btn-outline-success${
                            discountedOnly ? " active" : ""
                        }`}
                        onClick={() => setDiscountedOnly((prev) => !prev)}
                    >
                        Solo scontati
                    </button>
                </div>
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-xl-3 g-5">
                    {filteredGames &&
                        filteredGames.map((videogame) => {
                            return (
                                <div key={videogame.id} className="col">
                                    <Link
                                        to={`/videogames/${videogame.slug}`}
                                        className="text-decoration-none"
                                    >
                                        <div className="card border-0 h-100">
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
                                                                €
                                                                {
                                                                    videogame.promo_price
                                                                }
                                                            </span>{" "}
                                                            <span className="text-decoration-line-through text-secondary">
                                                                €
                                                                {
                                                                    videogame.price
                                                                }
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
                {filteredGames?.length === 0 && (
                    <div className="text-center text-white mt-5">
                        Nessun risultato trovato.
                    </div>
                )}
            </div>
            <ProductAddToCartButton />
        </>
    );
}
