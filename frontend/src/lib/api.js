import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const registerUserApi = (userData) =>
  api.post("/api/v1/auth/register", userData);

export const loginUserApi = (userData) =>
  api.post("/api/v1/auth/login", userData);

export const logoutUserApi = () => api.post("/api/v1/auth/logout");