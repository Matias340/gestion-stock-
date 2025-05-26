import axios from "axios";

// Instancia para productos y ventas ya la tienes.
const APICIERRE = axios.create({
  baseURL: import.meta.env.VITE_API_CIERRE_URL, // Asegúrate de tener esta variable en tu .env
});

APICIERRE.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN ENVIADO:", token); // 👈 Agrega esta línea
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Crear un cierre de caja
export const crearCierreCaja = (cierreData) => {
  return APICIERRE.post("/", cierreData);
};

// Obtener todos los cierres de caja del usuario logueado
export const obtenerCierresCaja = () => {
  return APICIERRE.get("/");
};

export const eliminarCierreCaja = (id) => {
  return APICIERRE.delete(`/${id}`);
};
