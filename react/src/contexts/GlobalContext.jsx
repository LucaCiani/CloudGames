import { createContext, useContext } from "react";

const GlobalContext = createContext();

function GlobalProvider({ children }) {
    return (
        <GlobalContext.Provider
            value={
                {
                    /* context values here */
                }
            }
        >
            {children}
        </GlobalContext.Provider>
    );
}

function useGlobalContext() {
    return useContext(GlobalContext);
}

export { GlobalProvider, useGlobalContext };
