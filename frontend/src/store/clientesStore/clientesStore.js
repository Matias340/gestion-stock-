import { create } from "zustand";
import { createCliente, deleteCliente, fetchCliente, fetchClienteById, updateCliente } from "../../api/apiClientes";

const useClienteStore = create((set, get) => ({
  clientes: [],
  selectedClientes: [],
  currentClientes: null,
  notification: null,

  setUserId: (id) => set({ userId: id }),

  fetchCliente: async () => {
    try {
      const { data } = await fetchCliente();
      console.log("Datos recibidos del backend:", data);
      set({ clientes: data });
    } catch (error) {
      set({
        clientes: [],
        notification: { message: "Error al cargar los Clientes", type: "error" },
      });
    }
  },

  fetchClienteDetails: async (clienteId) => {
    try {
      if (!clienteId) {
        console.error("El clienteId no está definido:", clienteId);
        throw new Error("El clienteId no está definido");
      }

      const response = await fetchClienteById(clienteId);

      if (!response || !response.data) {
        throw new Error("Cliente no encontrado");
      }

      return response.data;
    } catch (error) {
      console.error("Error al obtener el Cliente:", error);
      return null;
    }
  },

  addCliente: async (cliente) => {
    try {
      await createCliente(cliente);
      await get().fetchCliente(); // Recarga todos los clientes
      set({
        notification: {
          message: "Cliente creado exitosamente",
          type: "success",
        },
      });
    } catch (error) {
      set({
        notification: { message: "No se pudo crear el cliente", type: "error" },
      });
    }
  },

  updateCliente: async (id, updatedCliente) => {
    try {
      await updateCliente(id, updatedCliente);
      set((state) => ({
        clientes: state.clientes.map((cliente) => (cliente._id === id ? updatedCliente : cliente)),
        notification: {
          message: "Cliente actualizado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo actualizar el cliente",
          type: "error",
        },
      });
    }
  },

  removeCliente: async (id) => {
    try {
      await deleteCliente(id);
      set((state) => ({
        clientes: state.clientes.filter((cliente) => cliente._id !== id),
        notification: {
          message: "Cliente eliminado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo eliminar el Cliente",
          type: "error",
        },
      });
    }
  },

  setCurrentClientes: (cliente) => set({ currentClientes: cliente }),
  clearCurrentClientes: () => set({ currentClientes: null }),
  clearNotification: () => set({ notification: null }),
}));

export default useClienteStore;
