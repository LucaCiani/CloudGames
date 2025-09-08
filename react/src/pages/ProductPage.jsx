import { useParams } from "react-router-dom";
import useGlobalContext from "../contexts/useGlobalContext";
import ProductMediaGallery from "../components/Components_SinglePage/ProductMediaGallery";
import ProductInfo from "../components/Components_SinglePage/ProductInfo";
import ProductPrice from "../components/Components_SinglePage/ProductPrice";
import ProductBadges from "../components/Components_SinglePage/ProductBadges";
import ProductDetails from "../components/Components_SinglePage/ProductDetails";
import ProductAddToCartButton from "../components/Components_SinglePage/ProductAddToCartButton";

export default function ProductPage() {
  const { id } = useParams();
  const { videogames } = useGlobalContext();

  const SingleVideogame = videogames?.find((game) => game.id === parseInt(id));

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

  return (
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
          />
        </div>
      </div>
    </div>
  );
}
