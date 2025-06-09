import { create } from "zustand";
import { deleteSales, fetchVenta, marcarComoCobrada } from "../../api/apiProducto";

const useVentaStore = create((set, get) => ({
  ventaProducts: [],
  mostrarHistorial: true,
  notification: null,
  toggleHistorial: () => set((state) => ({ mostrarHistorial: !state.mostrarHistorial })),

  setUserId: (id) => set({ userId: id }),

  fetchVentaDetails: async () => {
    try {
      const { data } = await fetchVenta();
      set({ ventaProducts: data });
    } catch (error) {
      set({
        ventaProducts: [],
        notification: { message: "Error al cargar los ventas", type: "error" },
      });
    }
  },

  removeSales: async (id) => {
    try {
      await deleteSales(id);
      set((state) => ({
        ventaProducts: state.ventaProducts.filter((ventaProduct) => ventaProduct._id !== id),
        notification: {
          message: "Venta eliminada exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo eliminar la venta",
          type: "error",
        },
      });
    }
  },

  markSaleAsPaid: async (id) => {
    try {
      await marcarComoCobrada(id);
      // Volvés a traer la lista actualizada
      const { data } = await fetchVenta();
      set({
        ventaProducts: data,
        notification: {
          message: "Venta marcada como cobrada",
          type: "success",
        },
      });
    } catch (error) {
      set({
        notification: {
          message: "No se pudo marcar como cobrada",
          type: "error",
        },
      });
    }
  },
}));

export default useVentaStore;
