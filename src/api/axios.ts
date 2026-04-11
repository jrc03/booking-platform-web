import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  // Use Vite's environment variables. Fallback to localhost if not set.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5053/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized! Token expired or invalid.");
        useAuthStore.getState().logout();
      } else if (error.response.status === 403) {
        console.warn("Forbidden! You lack the correct role for this action.");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
