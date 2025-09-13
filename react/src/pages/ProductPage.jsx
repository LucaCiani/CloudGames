import { useParams, Link } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import ProductMediaGallery from "../components/Components_SinglePage/ProductMediaGallery";
import ProductInfo from "../components/Components_SinglePage/ProductInfo";
import ProductPrice from "../components/Components_SinglePage/ProductPrice";
import ProductBadges from "../components/Components_SinglePage/ProductBadges";
import ProductDetails from "../components/Components_SinglePage/ProductDetails";
import ProductAddToCartButton from "../components/Components_SinglePage/ProductAddToCartButton";

export default function ProductPage() {
  const { slug } = useParams();
  const { videogames, cartItems, handleAddToCart } = useGlobalContext();

  const SingleVideogame = videogames?.find((game) => game.slug === slug);

  if (!SingleVideogame) {
    return (
      <div className="container my-5">
        <h2>Prodotto non trovato</h2>
      </div>
    );
  }

  const relatedVideogames = videogames.filter((vg) => {
    return (
      SingleVideogame.genres.every((genre) => vg.genres.includes(genre)) &&
      vg.id !== SingleVideogame.id
    );
  });

  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <ProductMediaGallery
              media={SingleVideogame.media}
              productName={SingleVideogame.name}
            />
          </div>

          <div className="col-lg-6">
            <ProductInfo
              name={SingleVideogame.name}
              vote={SingleVideogame.vote}
              developer={SingleVideogame.developer}
            />

            <ProductPrice
              price={SingleVideogame.price}
              promo_price={SingleVideogame.promo_price}
            />

            <ProductDetails
              description={SingleVideogame.description}
              release_date={SingleVideogame.release_date}
              quantity={SingleVideogame.quantity}
            />

            <ProductBadges
              platforms={SingleVideogame.platforms}
              genres={SingleVideogame.genres}
            />

            <ProductAddToCartButton
              quantity={SingleVideogame.quantity}
              product={SingleVideogame}
            />
          </div>
        </div>
      </div>
      <div className="container my-5">
        <h3 className="text-center mb-5">Prodotti correlati</h3>
        <div className="row justify-content-center">
          {relatedVideogames.length === 0 ? (
            <div className="col-12 text-center text-secondary">
              Nessun gioco correlato disponibile.
            </div>
          ) : (
            relatedVideogames.slice(0, 3).map((relatedVg) => {
              return (
                <div
                  key={relatedVg.id}
                  className="col-12 col-md-6 col-lg-4 mb-4 px-3"
                  style={{
                    scale: 1,
                  }}
                >
                  <div className="card border-0 h-100">
                    <Link
                      to={`/videogames/${relatedVg.slug}`}
                      className="text-decoration-none"
                    >
                      <img
                        src={relatedVg.image_url}
                        alt={relatedVg.name}
                        className="card-img-top rounded list-card-hover"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                    <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                      <span className="fw-bold text-truncate text-white">
                        {relatedVg.name}
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <span>
                          {relatedVg.promo_price ? (
                            <span className="text-nowrap">
                              <span className="text-success fw-bold">
                                €{relatedVg.promo_price}
                              </span>{" "}
                              <span className="text-decoration-line-through text-secondary">
                                €{relatedVg.price}
                              </span>
                            </span>
                          ) : (
                            <>€{relatedVg.price}</>
                          )}
                        </span>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleAddToCart(1, relatedVg)}
                          disabled={
                            (cartItems.find((item) => item.id === relatedVg.id)
                              ?.cartQuantity || 0) >= (relatedVg.quantity || 1)
                          }
                        >
                          <i className="bi bi-plus-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
