import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DefaultLayout from "./layouts/DefaultLayout";
import { GlobalProvider } from "./contexts/GlobalContext";
import VideogamesPage from "./pages/VideogamesPage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/videogames" element={<VideogamesPage />} />
            <Route path="/aboutus" element={<AboutUsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;