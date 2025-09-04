import BlurText from "./BlurText";
import { NavLink } from "react-router-dom";

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
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/aboutus">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/videogames">Videogames</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
