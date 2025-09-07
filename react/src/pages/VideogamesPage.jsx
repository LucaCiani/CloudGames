import useGlobalContext from "../contexts/useGlobalContext";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function VideogamesPage() {
    const { videogames } = useGlobalContext();
    const query = useQuery();
    const search = query.get("search")?.toLowerCase() || "";

    const filteredGames = search
        ? videogames.filter((vg) => vg.name.toLowerCase().includes(search))
        : videogames;

    return (
        <>
            <div className="container my-5">
                {search && (
                    <p className="text-white mb-4">
                        Risultati per:{" "}
                        <span className="fw-bold">{query.get("search")}</span>
                    </p>
                )}
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-xl-3 g-5">
                    {filteredGames &&
                        filteredGames.map((videogame) => {
                            return (
                                <div key={videogame.id} className="col">
                                    <Link
                                        to={`/product/${videogame.id}`}
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
                {filteredGames.length === 0 && (
                    <div className="text-center text-white mt-5">
                        Nessun risultato trovato.
                    </div>
                )}
            </div>
        </>
    );
}
