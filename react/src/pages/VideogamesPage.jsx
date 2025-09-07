import useGlobalContext from "../contexts/useGlobalContext";
import { Link } from "react-router-dom";

export default function VideogamesPage() {
  const { videogames } = useGlobalContext();

  return (
    <>
      <div className="container my-5">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-xl-3 g-5">
          {videogames &&
            videogames.map((videogame) => {
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
      </div>
    </>
  );
}
