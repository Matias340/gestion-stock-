import { toast } from "react-toastify";
import { create } from "zustand";
import { crearCierreCaja, eliminarCierreCaja, obtenerCierresCaja } from "../../api/apiCierreCajas.js";
const useCierreStore = create((set) => ({
  cierres: [],
  loading: false,
  error: null,

  // Obtener cierres
  fetchCierres: async () => {
    set({ loading: true, error: null });
    try {
      const res = await obtenerCierresCaja();
      set({ cierres: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error al obtener cierres", loading: false });
    }
  },

  // Crear un cierre de caja
  crearCierre: async (cierreData) => {
    set({ loading: true, error: null });
    try {
      const res = await crearCierreCaja(cierreData);
      set((state) => ({
        cierres: [...state.cierres, res.data.cierre], // <-- ajustado
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Error al crear cierre", loading: false });
    }
  },

  eliminarCierre: async (id) => {
    try {
      await eliminarCierreCaja(id); // Llama a la API
      set((state) => ({
        cierres: state.cierres.filter((cierre) => cierre._id !== id),
      }));
      toast.success("¡Cierre de caja eliminado con éxito!");
    } catch (error) {
      console.error("Error al eliminar el cierre:", error);
      toast.error("Error al eliminar el cierre de caja.");
    }
  },

  // Limpiar errores
  limpiarError: () => set({ error: null }),
}));

export default useCierreStore;
