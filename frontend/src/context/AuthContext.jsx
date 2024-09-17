import { api } from "@/lib/api";
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [requestStatus, setRequestStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get("/api/v1/auth/me");
        const data = response.data;

        const userData = {
          id: data.data.id,
          email: data.data.email,
        };

        if (userData) {
          setUser(userData);
          // Update the request status to signal you've finished fetching the user
          setRequestStatus("complete");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
  }, []);

  const login = async (userData) => {
    try {
      await api.post("/api/v1/auth/login", userData);
      const response = await api.get("/api/v1/auth/me");
      const data = response.data;
      if (data.success === true) {
        const userData = { id: data.data.id, email: data.data.email };
        setUser(userData);
        navigate("/");
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch {
      console.log("catch block called");
      throw new Error("Invalid Credentials");
    }
  };

  const register = async (userData) => {
    try {
      await api.post("/api/v1/auth/register", userData);
      const response = await api.get("/api/v1/auth/me");
      const data = response.data;

      if (data.success === true) {
        const userData = { id: data.data.id, email: data.data.email };
        setUser(userData);
        navigate("/");
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch {
      throw new Error("Invalid Credentials");
    }
  };

  const logout = async () => {
    try {
      await api.post("api/v1/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, requestStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}
