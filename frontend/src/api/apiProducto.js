import axios from 'axios';

const APIPRODUCTO = axios.create({ baseURL: import.meta.env.VITE_API_PRODUCTO_URL });
const APIVENTA = axios.create({ baseURL: import.meta.env.VITE_API_VENTA_URL });

export const fetchProduct = () => APIPRODUCTO.get('/');
export const fetchProductById = (id) => APIPRODUCTO.get(`/${id}`);
export const getProductByBarcode = (barcode) => APIPRODUCTO.get(`/barcode/${barcode}`);
export const createProduct = (newItem) => APIPRODUCTO.post('/', newItem);
export const updateProduct = (id, updatedItem) => APIPRODUCTO.put(`/${id}`, updatedItem);
export const deleteProduct = (id) => APIPRODUCTO.delete(`/${id}`);
export const fetchVenta = () => APIVENTA.get('/');
export const realizarVenta = (productos, total, medioPago) => {
  console.log("Enviando productos al backend:", productos);
  return APIVENTA.post(`/`, { products: productos, total, medioPago }); // Ahora incluimos paymentMethod
};
