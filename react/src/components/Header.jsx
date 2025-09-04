import BlurText from "./BlurText";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function HeaderComponent() {
  return (
    <>
      
      <nav className="navbar navbar-expand-lg navbar-fixed-transparent">
                <div className="container">
                    <h2>CLOUDGAMES</h2>
                    <ul className="navbar-nav ms-auto d-flex flex-row gap-3">
                        <li className="nav-item">
                            <a className="nav-link" to="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" to="/About">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" to="/Products">Products</a>
                        </li>
                    </ul>
                </div>
            </nav>
      <div className="header-img-container">
        <img
          src="/jumbotron.png"
          alt="jumbotron"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
          <BlurText
            text="Isn't this so cool?!"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="fs-1 mb-4 justify-content-center text-center"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          />
        </div>
      </div>
    </>
  );
}
