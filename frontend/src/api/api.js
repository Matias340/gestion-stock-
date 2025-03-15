import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000/api/product' });

export const fetchProduct = () => API.get('/');
export const createProduct = (newItem) => API.post('/', newItem);
export const updateProduct = (id, updatedItem) => API.put(`/${id}`, updatedItem);
export const deleteProduct = (id) => API.delete(`/${id}`);