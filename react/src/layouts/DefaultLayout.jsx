import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DefaultLayout() {
    return (
        <>
            <header>
                <Header />
            </header>
            <main className="my-4">
                <Outlet />
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
