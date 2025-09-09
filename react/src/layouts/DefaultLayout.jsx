import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WelcomePopup from "../components/WelcomePopup";

export default function DefaultLayout() {
  return (
    <>
      <WelcomePopup />
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
