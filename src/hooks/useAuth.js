import { useContext } from "react";

const { createContext } = require("react");

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
