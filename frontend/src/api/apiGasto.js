import axios from 'axios';

const APIGASTO = axios.create({ baseURL: import.meta.env.VITE_API_GASTO_URL });

APIGASTO.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ← este formato es importante
    }
    return config;
  });

export const fetchGasto = () => APIGASTO.get('/');
export const createGasto = (newItem) => APIGASTO.post('/', newItem);
export const fetchGastoById = (id) => APIGASTO.get(`/${id}`);
export const updateGasto = (id, updatedItem) => APIGASTO.put(`/${id}`, updatedItem);
export const deleteGasto = (id) => APIGASTO.delete(`/${id}`);

