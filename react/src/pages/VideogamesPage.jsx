import { useState } from "react";
import useGlobalContext from "../contexts/useGlobalContext";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function VideogamesPage() {
    const { videogames } = useGlobalContext();
    const query = useQuery();
    const search = query.get("search")?.toLowerCase() || "";

    // Stati per ordinamento e filtro
    const [sortOrder, setSortOrder] = useState("az");
    const [filter, setFilter] = useState("all");

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

    // Filtra per piattaforma o scontati
    if (filter !== "all") {
        if (filter === "discounted") {
            filteredGames = filteredGames?.filter(
                (vg) => vg.promo_price !== null && vg.promo_price !== undefined
            );
        } else {
            filteredGames = filteredGames?.filter((vg) =>
                (vg.platforms || []).includes(filter)
            );
        }
    }

    // Ordina i giochi
    if (filteredGames) {
        filteredGames = [...filteredGames].sort((a, b) => {
            if (sortOrder === "az") {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
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
                            {filter === "all" || filter === "discounted"
                                ? "Tutte le piattaforme"
                                : filter}
                        </button>
                        <ul
                            className="dropdown-menu"
                            aria-labelledby="filterDropdown"
                        >
                            <li>
                                <button
                                    className={`dropdown-item${
                                        filter === "all" ||
                                        filter === "discounted"
                                            ? " active"
                                            : ""
                                    }`}
                                    onClick={() => setFilter("all")}
                                >
                                    Tutte le piattaforme
                                </button>
                            </li>
                            {allPlatforms.map((platform) => (
                                <li key={platform}>
                                    <button
                                        className={`dropdown-item${
                                            filter === platform ? " active" : ""
                                        }`}
                                        onClick={() => setFilter(platform)}
                                    >
                                        {platform}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Pulsante solo scontati */}
                    <button
                        className={`btn btn-sm btn-outline-success${
                            filter === "discounted" ? " active" : ""
                        }`}
                        onClick={() =>
                            setFilter(
                                filter === "discounted" ? "all" : "discounted"
                            )
                        }
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
                                        to={`/videogames/${videogame.id}`}
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
        </>
    );
}
