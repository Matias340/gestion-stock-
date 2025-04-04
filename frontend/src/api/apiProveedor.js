import axios from 'axios';

const APIPROVEEDOR = axios.create({ baseURL: import.meta.env.VITE_API_APIPROVEEDOR_URL });

export const fetchProveedor = () => APIPROVEEDOR.get('/');
export const fetchProveedorById = (id) => APIPROVEEDOR.get(`/${id}`);
export const getProveedorByName = (name) => APIPROVEEDOR.get(`/name/${name}`);
export const createProveedor = (newItem) => APIPROVEEDOR.post('/', newItem);
export const updateProveedor = (id, updatedItem) => APIPROVEEDOR.put(`/${id}`, updatedItem);
export const deleteProveedor = (id) => APIPROVEEDOR.delete(`/${id}`);
