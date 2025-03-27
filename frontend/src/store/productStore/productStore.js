import { create } from "zustand";
import {
  fetchProduct,
  fetchProductById,
  getProductByBarcode,
  createProduct,
  deleteProduct,
  updateProduct,
  realizarVenta,
} from "../../api/api";

const useProductStore = create((set, get) => ({
  products: [],
  selectedProducts: [], // Productos seleccionados en la compra
  ventaProducts: [],
  paymentMethod: "efectivo",
  currentProduct: null,
  notification: null,

  setPaymentMethod: (method) => set({ paymentMethod: method }),

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

  fetchProductDetails: async (productId) => {
    try {
      // Verificar que productId no sea undefined
      if (!productId) {
        console.error("El productId no está definido:", productId);
        throw new Error("El productId no está definido");
      }
  
      let response;
      
      // Si el productId es un barcode (lo asumimos si es un string de longitud más corta)
      if (productId.length < 10) {  // Suponiendo que los barcodes son más cortos que los _id
        console.log("Buscando producto por barcode");
        response = await getProductByBarcode(productId);  // Usamos la nueva función
      } else {
        console.log("Buscando producto por _id");
        response = await fetchProductById(productId);  // Usamos la función existente
      }
  
      if (!response || !response.data) {
        throw new Error('Producto no encontrado');
      }
      
      return response.data;  // Regresamos el producto encontrado
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      return null;  // Si no se encuentra, regresamos null
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
  addToProduct: async (product, quantity) => {
    console.log("Producto recibido:", product);
    
    // Si no tiene _id, usa barcode como identificador
    const productId = product._id || product.barcode;
    
    if (!productId) {
      console.error("No se puede obtener un identificador para el producto.");
      return;
    }
  
    // Llamamos a fetchProductDetails con el productId
    const productDetails = await get().fetchProductDetails(productId);
  
    if (productDetails) {
      set((state) => {
        const existingProduct = state.selectedProducts.find(
          (p) => p._id === productDetails._id && p.price === productDetails.price
        );
  
        if (existingProduct) {
          return {
            selectedProducts: state.selectedProducts.map((p) =>
              p._id === productDetails._id && p.price === productDetails.price
                ? { ...p, quantity: p.quantity + quantity }
                : p
            ),
          };
        } else {
          return {
            selectedProducts: [
              ...state.selectedProducts,
              { ...productDetails, quantity }, // Usamos productDetails que ya incluye _id
            ],
          };
        }
      });
    } else {
      console.error("No se pudo obtener el detalle del producto.");
    }
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

  completePurchase: async () => {
    try {
        const { selectedProducts, getTotal, paymentMethod } = get();
        console.log("Productos que se están enviando:", selectedProducts);

        if (!selectedProducts.length) {
            return { success: false, message: "El carrito está vacío" };
        }

        const productosFormateados = selectedProducts.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));

        const total = getTotal();

        console.log("Enviando datos al backend:", { products: productosFormateados, total, medioPago: paymentMethod });
        
        const response = await realizarVenta(productosFormateados, total, paymentMethod); // 📌 Enviar `medioPago`

        if (response.status === 201) {
            set({
                selectedProducts: [],
                notification: { type: "success", message: "Compra realizada correctamente" }
            });
            return response.data;
        } else {
            set({
                notification: { type: "error", message: response.data.message }
            });
            return response.data;
        }
    } catch (error) {
        console.error("Error al completar la compra:", error);
        set({
            notification: { type: "error", message: "Error al completar la compra" }
        });
        return { success: false, message: "Error al completar la compra" };
    }
  },

}));

export default useProductStore;
