import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

export default function useGlobalContext() {
  return useContext(GlobalContext);
}
