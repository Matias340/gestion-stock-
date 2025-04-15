import { create } from "zustand";
import {
  createGasto,
  fetchGasto,
  fetchGastoById,
  updateGasto,
  deleteGasto
} from "../../api/apiGasto";

const useGastoStore = create((set, get) => ({
  gastos: [],
  notification: null,

  setUserId: (id) => set({ userId: id }),

  fetchGasto: async () => {
    try {
      const { data } = await fetchGasto();
      set({ gastos: data });
    } catch (error) {
      set({
        gastos: [],
        notification: { message: "Error al cargar los gastos", type: "error" },
      });
    }
  },
  
  fetchGastoDetails: async (gastoId) => {
    try {
      // Verificar que productId no sea undefined
      if (!gastoId) {
        console.error("El gastoId no está definido:", gastoId);
        throw new Error("El gastoId no está definido");
      }
  
      let response;
      
      await fetchGastoById(gastoId);
      
      if (!response || !response.data) {
        throw new Error('Gasto no encontrado');
      }
      
      return response.data;  // Regresamos el producto encontrado
    } catch (error) {
      console.error('Error al obtener el gasto:', error);
      return null;  // Si no se encuentra, regresamos null
    }
  },

  addGasto: async (gasto) => {
    try {
      await createGasto (gasto);
      set((state) => ({
        gastos: [...state.gastos, gasto],
        notification: {
          message: "Gasto creado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: { message: "No se pudo crear el gasto", type: "error" },
      });
    }
  },

  actualizarGasto: async (id, updatedGasto) => {
    try {
      await updateGasto(id, updatedGasto);
      set((state) => ({
        gastos: state.gastos.map((gasto) =>
        gasto._id === id ? updatedGasto : gasto
        ),
        notification: {
          message: "Gasto actualizado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo actualizar el gasto",
          type: "error",
        },
      });
    }
  },

  removeGasto: async (id) => {
    try {
      await deleteGasto(id);
      set((state) => ({
        gastos: state.gastos.filter((gasto) => gasto._id !== id),
        notification: {
          message: "Gasto eliminado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo eliminar el gasto",
          type: "error",
        },
      });
    }
  },

  setCurrentGasto: (gasto) => set({ currentGasto: gasto }),
  clearCurrentGasto: () => set({ currentGasto: null }),
  clearNotification: () => set({ notification: null }),

}));

export default useGastoStore;
