import axios from 'axios';

const APIPROVEEDOR = axios.create({ baseURL: import.meta.env.VITE_API_APIPROVEEDOR_URL });

APIPROVEEDOR.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ← este formato es importante
    }
    return config;
  });

export const fetchProveedor = () => APIPROVEEDOR.get('/');
export const fetchProveedorById = (id) => APIPROVEEDOR.get(`/${id}`);
export const getProveedorByName = (name) => APIPROVEEDOR.get(`/name/${name}`);
export const createProveedor = (newItem) => APIPROVEEDOR.post('/', newItem);
export const updateProveedor = (id, updatedItem) => APIPROVEEDOR.put(`/${id}`, updatedItem);
export const deleteProveedor = (id) => APIPROVEEDOR.delete(`/${id}`);
