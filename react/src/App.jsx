import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DefaultLayout from "./layouts/DefaultLayout";
import { GlobalProvider } from "./contexts/GlobalContext";
import VideogamesPage from "./pages/VideogamesPage";
import AboutUsPage from "./pages/AboutUsPage";
import ProductPage from "./pages/ProductPage";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage"

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/videogames" element={<VideogamesPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/videogames/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
