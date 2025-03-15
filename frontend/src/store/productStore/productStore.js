import { create } from 'zustand';
import { fetchProduct, createProduct, updateProduct, deleteProduct } from '../../api/api';

const useProductStore = create((set) => ({
    products: [],
    currentProduct: null,
    notification: null,

    fetchProduct: async () => {
        try {
            const { data } = await fetchProduct();
            
            set({ products: data });
        } catch (error) {
            set({ notification: { message: 'Error al cargar los productos', type: 'error' } });
        }
    },

    addProduct: async (product) => {
        try {
            await createProduct(product);
            set((state) => ({ 
                products: [...state.products, product], 
                notification: { message: 'Producto creado exitosamente', type: 'success' }
            }));
        } catch (error) {
            set({ notification: { message: 'No se pudo crear el producto', type: 'error' } });
        }
    },

    updateProduct: async (id, updatedProduct) => {
        try {
            await updateProduct(id, updatedProduct);
            set((state) => ({
                products: state.products.map((product) => (product._id === id ? updatedProduct : product)),
                notification: { message: 'Producto actualizado exitosamente', type: 'success' }
            }));
        } catch (error) {
            set({ notification: { message: 'No se pudo actualizar el producto', type: 'error' } });
        }
    },

    removeProduct: async (id) => {
        try {
            await deleteProduct(id);
            set((state) => ({
                products: state.products.filter((product) => product._id !== id),
                notification: { message: 'producto eliminada exitosamente', type: 'success' }
            }));
        } catch (error) {
            set({ notification: { message: 'No se pudo eliminar el producto', type: 'error' } });
        }
    },

    setCurrentProduct: (product) => set({ currentProduct: product }),
    clearCurrentProduct: () => set({ currentProduct: null }),
    clearNotification: () => set({ notification: null }),
}));

export default useProductStore;
