import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  const login = async (userData) => {
    try {
      const response = await api.post("/api/v1/auth/login", userData);
      const data = response.data;
      console.log(data);

      if (data.success === true) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (e) {
      // console.log(e);
      if (isAxiosError(e) && e.response?.data) {
        return { success: false, message: e.response.data.message };
      } else {
        return { success: false, message: "An error occurred" };
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
