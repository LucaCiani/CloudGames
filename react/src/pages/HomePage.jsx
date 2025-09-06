/* import JumbotronText from "../components/JumbotronText"; */
import Highlighted from "../components/Highlighted";
import HomePageDiscount from "../components/HomePageDiscount";

/* const handleAnimationComplete = () => {
  console.log("Animation completed!");
}; */

export default function HomePage() {
  return (
    <>
      <div className="header-img-container">
        <img
          src="/jumbo3.jpg"
          alt="Cloud Games Jumbotron"
          className="jumbotron-img img-fluid w-100"
        />
      </div>
      <Highlighted />
      <HomePageDiscount />
    </>
  );
}
