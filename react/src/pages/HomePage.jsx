export default function HomePage() {
    return (
        <>
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
            <h2>Homepage</h2>
        </>
    );
}
