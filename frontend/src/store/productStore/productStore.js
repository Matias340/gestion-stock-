import { create } from "zustand";
import {
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/api";

const useProductStore = create((set, get) => ({
  products: [],
  selectedProducts: [], // Productos seleccionados en la compra
  currentProduct: null,
  notification: null,

  fetchProduct: async () => {
    try {
      const { data } = await fetchProduct();
      set({ products: data });
    } catch (error) {
      set({
        notification: { message: "Error al cargar los productos", type: "error" },
      });
    }
  },

  addProduct: async (product) => {
    try {
      await createProduct(product);
      set((state) => ({
        products: [...state.products, product],
        notification: {
          message: "Producto creado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: { message: "No se pudo crear el producto", type: "error" },
      });
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      await updateProduct(id, updatedProduct);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? updatedProduct : product
        ),
        notification: {
          message: "Producto actualizado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo actualizar el producto",
          type: "error",
        },
      });
    }
  },

  removeProduct: async (id) => {
    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        notification: {
          message: "Producto eliminado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo eliminar el producto",
          type: "error",
        },
      });
    }
  },

  // Guardar el producto actual
  setCurrentProduct: (product) => set({ currentProduct: product }),
  clearCurrentProduct: () => set({ currentProduct: null }),
  clearNotification: () => set({ notification: null }),

  // Agregar productos al carrito con cantidad
  addToProduct: (product, quantity) => {
    set((state) => {
      // Verificar si el producto con ese _id y price ya existe en el carrito
      const existingProduct = state.selectedProducts.find(
        (p) => p._id === product._id && p.price === product.price
      );
  
      if (existingProduct) {
        // Si el producto ya está en el carrito, actualizamos la cantidad
        return {
          selectedProducts: state.selectedProducts.map((p) =>
            p._id === product._id && p.price === product.price
              ? { ...p, quantity: p.quantity + quantity } // Sumamos la cantidad si es el mismo producto con el mismo precio
              : p
          ),
        };
      } else {
        // Si es un producto nuevo, lo agregamos al carrito con la cantidad
        return {
          selectedProducts: [
            ...state.selectedProducts,
            { ...product, quantity }, // Se agrega el producto con la cantidad especificada
          ],
        };
      }
    });
  },

  updateProductQuantity: (productId, productPrice, newQuantity) => {
    set((state) => ({
      selectedProducts: state.selectedProducts.map((product) =>
        product._id === productId && product.price === productPrice
          ? { ...product, quantity: newQuantity } // Solo cambia la cantidad del producto específico
          : product
      ),
    }));
  },

  // Eliminar producto del carrito
  removeFromCart: (id, price) => {
    set((state) => ({
      selectedProducts: state.selectedProducts.filter(
        (p) => !(p._id === id && p.price === price)
      ),
    }));
  },

  // Obtener total con IVA
  getTotal: () => {
    return get().selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity * 1.21, // IVA 21%
      0
    );
  },
}));

export default useProductStore;
