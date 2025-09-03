import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";

export default function DefaultLayout() {
    return (
        <>
            <header>
                <HeaderComponent />
            </header>
            <main>
                <div>
                    <Outlet />
                </div>
            </main>
            <footer></footer>
        </>
    );
}
