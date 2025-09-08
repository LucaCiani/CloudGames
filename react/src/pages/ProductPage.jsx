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
  const { videogames } = useGlobalContext();

  const SingleVideogame = videogames?.find((game) => game.slug === slug);

  if (!SingleVideogame) {
    return (
      <div className="container my-5">
        <h2>Prodotto non trovato</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Logica per aggiungere al carrello
    console.log("Aggiunto al carrello:", SingleVideogame);
  };


  const relatedVideogames = videogames.filter(vg => {
    return SingleVideogame.genres.every(genre => vg.genres.includes(genre)) &&
      vg.id !== SingleVideogame.id;
  });

  console.log(relatedVideogames);

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
              onAddToCart={handleAddToCart}
              product={SingleVideogame}
            />
          </div>
        </div>
      </div>
      <div className="py-5">
        <h3 className="text-center mb-5">
          Prodotti correlati
        </h3>
        <div className="row row-cols-sm-1 row-cols-md-3 row-cols-xl-4 px-5 mb-4 container-fluid">

          {relatedVideogames.slice(0, 4).map((relatedVg) => {
            return (
              <div key={relatedVg.id} className="col" style={{
                scale: 1
              }} >
                <Link
                  to={`/videogames/${relatedVg.id}`}
                  className="text-decoration-none"
                >
                  <div className="card border-0 h-100">
                    <img
                      src={relatedVg.image_url}
                      alt={relatedVg.name}
                      className="card-img-top rounded"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                      <span className="fw-bold text-truncate text-white">
                        {relatedVg.name}
                      </span>
                      <span>
                        {relatedVg.promo_price ? (
                          <>
                            <span className="text-success fw-bold">
                              €
                              {
                                relatedVg.promo_price
                              }
                            </span>{" "}
                            <span className="text-decoration-line-through text-secondary">
                              €
                              {
                                relatedVg.price
                              }
                            </span>
                          </>
                        ) : (
                          <>€{relatedVg.price}</>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
