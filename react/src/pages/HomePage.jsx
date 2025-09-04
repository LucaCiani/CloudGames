import JumbotronText from "../components/JumbotronText";
import Highlighted from "../components/Highlighted";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function HomePage() {
  return (
    <>
      <div className="header-img-container">
        <img src="/jumbotron1.jpg" alt="jumbotron" className="jumbotron-img" />
        <JumbotronText onAnimationComplete={handleAnimationComplete} />
      </div>
      <Highlighted />
    </>
  );
}