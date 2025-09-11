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

  const handleAddToCart = (quantity, product, onAddToCart) => {
    if (quantity === 0 || !product) return;

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );
    let newCartItems;

    if (existingItemIndex > -1) {
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        cartQuantity: (newCartItems[existingItemIndex].cartQuantity || 1) + 1,
      };
    } else {
      newCartItems = [...cartItems, { ...product, cartQuantity: 1 }];
    }

    setCartItems(newCartItems); // 👈 Aggiornamento globale
    localStorage.setItem("videogames", JSON.stringify(newCartItems));

    if (onAddToCart) onAddToCart();

    console.log("Prodotto aggiunto:", product);
    console.log("Carrello aggiornato:", newCartItems);
  };

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
        handleAddToCart,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
