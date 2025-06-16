import axios from "axios";

const APICLIENTE = axios.create({
  baseURL: import.meta.env.VITE_API_CLIENTE_URL,
});

APICLIENTE.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ← este formato es importante
    console.log("Enviando token:", config.headers.Authorization);
  }
  return config;
});

export const fetchCliente = () => APICLIENTE.get("/");
export const fetchClienteById = (id) => APICLIENTE.get(`/${id}`);
export const createCliente = (newItem) => APICLIENTE.post("/", newItem);
export const updateCliente = (id, updatedItem) => APICLIENTE.put(`/${id}`, updatedItem);
export const deleteCliente = (id) => APICLIENTE.delete(`/${id}`);
