import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function DefaultLayout() {
  return (
    <>
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
