import axios from 'axios';

const APIPRODUCTO = axios.create({
  baseURL: import.meta.env.VITE_API_PRODUCTO_URL,
});

APIPRODUCTO.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ← este formato es importante
  }
  return config;
});
const APIVENTA = axios.create({ baseURL: import.meta.env.VITE_API_VENTA_URL });

export const fetchProduct = () => APIPRODUCTO.get('/');
export const fetchProductById = (id) => APIPRODUCTO.get(`/${id}`);
export const getProductByBarcode = (barcode) => APIPRODUCTO.get(`/barcode/${barcode}`);
export const createProduct = (newItem) => APIPRODUCTO.post('/', newItem);
export const updateProduct = (id, updatedItem) => APIPRODUCTO.put(`/${id}`, updatedItem);
export const deleteProduct = (id) => APIPRODUCTO.delete(`/${id}`);
export const fetchVenta = () => APIVENTA.get('/');
export const realizarVenta = (productos, total, medioPago, userId) => {
  console.log("Enviando productos al backend:", productos);
  return APIVENTA.post(`/`, { products: productos, total, medioPago, userId }); // Incluye userId
};
export const deleteSales = (id, userId) => APIVENTA.delete(`/${id}?userId=${userId}`);
