import { create } from "zustand";
import {
  bulkUploadProducts,
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProductById,
  getProductByBarcode,
  realizarVenta,
  updateProduct,
} from "../../api/apiProducto";

const useProductStore = create((set, get) => ({
  products: [],
  selectedProducts: [], // Productos seleccionados en la compra
  selectedClient: null,
  ventaProducts: [],
  paymentMethod: "efectivo",
  userId: null,
  currentProduct: null,
  currentClientes: null,
  notification: null,

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setUserId: (id) => set({ userId: id }),

  fetchProduct: async () => {
    try {
      const { data } = await fetchProduct();
      set({ products: data });
    } catch (error) {
      set({
        products: [], // Limpiar si hay error
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
      if (productId.length < 30) {
        // Suponiendo que los barcodes son más cortos que los _id
        console.log("Buscando producto por barcode");
        response = await getProductByBarcode(productId); // Usamos la nueva función
      } else {
        console.log("Buscando producto por _id");
        response = await fetchProductById(productId); // Usamos la función existente
      }

      if (!response || !response.data) {
        throw new Error("Producto no encontrado");
      }

      return response.data; // Regresamos el producto encontrado
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return null; // Si no se encuentra, regresamos null
    }
  },

  addProduct: async (product) => {
    try {
      const { data } = await createProduct(product); // usar data si tu backend lo retorna
      await get().fetchProduct(); // volver a cargar los productos correctamente
      set({
        notification: {
          message: "Producto creado exitosamente",
          type: "success",
        },
      });
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
        products: state.products.map((product) => (product._id === id ? updatedProduct : product)),
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
    const productId = product.barcode || product._id;

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
      selectedProducts: state.selectedProducts.filter((p) => !(p._id === id && p.price === price)),
    }));
  },

  // Obtener total con IVA
  getTotal: () => {
    return get().selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity * 1.21, // IVA 21%
      0
    );
  },

  setSelectedClient: (cliente) => set({ selectedClient: cliente }),

  completePurchase: async () => {
    try {
      const { selectedProducts, selectedClient, getTotal, paymentMethod, paymentDetail, userId } = get();
      console.log("selectedClient en completePurchase:", selectedClient);
      if (!selectedProducts.length) {
        return { success: false, message: "El carrito está vacío" };
      }
      console.log("selectedClient en completePurchase:", selectedClient);

      // Formateo de productos para enviar
      const productosFormateados = selectedProducts.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const clientesFormateados = selectedClient
        ? [
            {
              clienteId: selectedClient._id,
              nombre: selectedClient.nombre,
              email: selectedClient.email,
              notaCredito: selectedClient.notaCredito,
            },
          ]
        : [];

      const total = getTotal();

      // Llamada a la API
      const response = await realizarVenta(
        productosFormateados,
        clientesFormateados,
        total,
        paymentMethod,
        paymentDetail || null,
        userId
      );

      if (response.status === 201) {
        set({
          selectedProducts: [],
          notification: { type: "success", message: "Compra realizada correctamente" },
        });
        return response.data;
      } else {
        set({
          notification: { type: "error", message: response.data.message },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error al completar la compra:", error);
      set({
        notification: { type: "error", message: "Error al completar la compra" },
      });
      return { success: false, message: "Error al completar la compra" };
    }
  },

  bulkUploadProducts: async (file) => {
    try {
      const { data } = await bulkUploadProducts(file);
      // Actualiza la lista de productos
      await get().fetchProduct();
      set({
        notification: { message: "Productos cargados exitosamente", type: "success" },
      });
    } catch (error) {
      set({
        notification: { message: "Error al cargar los productos", type: "error" },
      });
    }
  },
}));

export default useProductStore;
