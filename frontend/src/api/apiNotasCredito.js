import axios from "axios";

const APINOTASCREDITO = axios.create({ baseURL: import.meta.env.VITE_API_NOTASCREDITO_URL });

APINOTASCREDITO.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Crear nota de crédito
export const createNotaCredito = (data) => APINOTASCREDITO.post("/", data);
