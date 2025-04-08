import axios from 'axios';

const APIGASTO = axios.create({ baseURL: import.meta.env.VITE_API_GASTO_URL });

export const fetchGasto = () => APIGASTO.get('/');
export const createGasto = (newItem) => APIGASTO.post('/', newItem);
export const fetchGastoById = (id) => APIGASTO.get(`/${id}`);
export const updateGasto = (id, updatedItem) => APIGASTO.put(`/${id}`, updatedItem);
export const deleteGasto = (id) => APIGASTO.delete(`/${id}`);

