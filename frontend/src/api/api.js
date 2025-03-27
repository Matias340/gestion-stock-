import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000/api/product' });
const APIVENTA = axios.create({ baseURL: 'http://localhost:4000/api/venta' });

export const fetchProduct = () => API.get('/');
export const fetchProductById = (id) => API.get(`/${id}`);
export const getProductByBarcode = (barcode) => API.get(`/barcode/${barcode}`);
export const createProduct = (newItem) => API.post('/', newItem);
export const updateProduct = (id, updatedItem) => API.put(`/${id}`, updatedItem);
export const deleteProduct = (id) => API.delete(`/${id}`);
export const fetchVenta = () => APIVENTA.get('/');
export const realizarVenta = (productos, total, medioPago) => {
  console.log("Enviando productos al backend:", productos);
  return APIVENTA.post(`/`, { products: productos, total, medioPago }); // Ahora incluimos paymentMethod
};