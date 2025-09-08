import Jumbotron from "../components/Jumbotron";
import Highlighted from "../components/Highlighted";
import HomePageDiscount from "../components/HomePageDiscount";
import ProductAddToCartButton from "../components/Components_SinglePage/ProductAddToCartButton";
/* const handleAnimationComplete = () => {
  console.log("Animation completed!");
}; */

export default function HomePage() {
  return (
    <>
      <Jumbotron />
      <Highlighted />
      <HomePageDiscount />
      <ProductAddToCartButton
      />
    </>
  );
}
