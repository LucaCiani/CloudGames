import { createContext, useState, useEffect, useContext } from "react";

const GlobalContext = createContext();

function GlobalProvider({ children }) {
    const videogamesApiUrl = import.meta.env.VITE_BACKEND_VIDEOGAMES_URL;
    const [videogames, setVideogames] = useState(null);
    const [alert, setAlert] = useState({
        type: "info",
        message: null,
    });

    useEffect(() => {
        fetch(videogamesApiUrl)
            .then((res) => res.json())
            .then((data) => setVideogames(data));
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                videogames,
                setVideogames,
                alert,
                setAlert,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

function useGlobalContext() {
    return useContext(GlobalContext);
}

export { GlobalProvider, useGlobalContext };
