import { createContext, useState, useEffect } from "react";

const GlobalContext = createContext();

function GlobalProvider({ children }) {
  const videogamesApiUrl = `${import.meta.env.VITE_API_BASE}/videogames`;
  const [videogames, setVideogames] = useState(null);
  const [alert, setAlert] = useState({
    type: "info",
    message: null,
  });

  const [cartItems, setCartItems] = useState([]);

  // Carichiamo il carrello dal localStorage all'inizio
  useEffect(() => {
    const storedCart = localStorage.getItem("videogames");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Aggiungiamo lo stato per il chatbot
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    fetch(videogamesApiUrl)
      .then((res) => res.json())
      .then((data) => setVideogames(data));
  }, [videogamesApiUrl]);

  return (
    <GlobalContext.Provider
      value={{
        videogames,
        setVideogames,
        alert,
        setAlert,
        cartItems,
        setCartItems,
        // Aggiungiamo chatMessages al context
        chatMessages,
        setChatMessages,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
