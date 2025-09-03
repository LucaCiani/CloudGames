import BlurText from "./BlurText";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export default function HeaderComponent() {
  return (
    <>
      <h1>Sono un header</h1>
      <img src="/jumbotron.png" alt="jumbotron" />
      <BlurText
  text="Isn't this so cool?!"
  delay={150}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-2xl mb-8"
/>
    </>
  );
}
