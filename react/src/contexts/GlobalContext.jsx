import { createContext } from "react";

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

export { GlobalProvider };
