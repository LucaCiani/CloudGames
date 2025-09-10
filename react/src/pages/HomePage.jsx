import Jumbotron from "../components/Jumbotron";
import Highlighted from "../components/Highlighted";
import HomePageDiscount from "../components/HomePageDiscount";
import ProductAddToCartButton from "../components/Components_SinglePage/ProductAddToCartButton";
import ChatBot from "../components/ChatBot";

export default function HomePage() {
  return (
    <>
      <Jumbotron />
      <Highlighted />
      <HomePageDiscount />
      <ProductAddToCartButton />
      <ChatBot />
    </>
  );
}
