import { create } from "zustand";
import {
  fetchVenta,
} from "../../api/api";

const useVentaStore = create((set, get) => ({
    ventaProducts: [],
    mostrarHistorial: true,
    toggleHistorial: () => set((state) => ({ mostrarHistorial: !state.mostrarHistorial })),

fetchVentaDetails: async () => {
    try {
      const { data } = await fetchVenta();
      set({ ventaProducts: data });
    } catch (error) {
      set({
        notification: { message: "Error al cargar los ventas", type: "error" },
      });
    }
  }

}));  

export default useVentaStore;