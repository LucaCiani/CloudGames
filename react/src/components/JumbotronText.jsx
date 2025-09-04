import BlurText from "./BlurText";

export default function JumbotronText({ onAnimationComplete }) {
  return (
    <div className="jumbotron-text">
      <BlurText
        text="Isn't this so cool?!"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={onAnimationComplete}
        className="fs-1 mb-4 justify-content-center text-center"
      />
    </div>
  );
}