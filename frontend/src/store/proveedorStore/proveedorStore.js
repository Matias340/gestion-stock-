import { create } from "zustand";
import {
  createProveedor,
  deleteProveedor,
  fetchProveedor,
  fetchProveedorById,
  getProveedorByName,
  updateProveedor,
} from "../../api/apiProveedor";

const useProveedorStore = create((set, get) => ({
  proveedores: [],
  selectedProveedores: [],
  state: "activo",
  currentProveedores: null,
  notification: null,

  setUserId: (id) => set({ userId: id }),

  fetchProveedor: async () => {
    try {
      const { data } = await fetchProveedor();
      set({ proveedores: data });
    } catch (error) {
      set({
        proveedores: [],
        notification: { message: "Error al cargar los proveedores", type: "error" },
      });
    }
  },

  fetchProveedorDetails: async (proveedorId) => {
    try {
      if (!proveedorId) {
        console.error("El proveedorId no está definido:", proveedorId);
        throw new Error("El proveedorId no está definido");
      }

      let response;

      if (proveedorId.length < 10) {
        response = await getProveedorByName(proveedorId);
      } else {
        response = await fetchProveedorById(proveedorId);
      }

      if (!response || !response.data) {
        throw new Error("Proveedor no encontrado");
      }

      return response.data;
    } catch (error) {
      console.error("Error al obtener el proveedor:", error);
      return null;
    }
  },

  addProveedor: async (proveedor) => {
    try {
      await createProveedor(proveedor);
      set((state) => ({
        proveedores: [...state.proveedores, proveedor],
        notification: {
          message: "Proveedor creado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: { message: "No se pudo crear el proveedor", type: "error" },
      });
    }
  },

  updateProveedor: async (id, updatedProveedor) => {
    try {
      await updateProveedor(id, updatedProveedor);
      set((state) => ({
        proveedores: state.proveedores.map((proveedor) => (proveedor._id === id ? updatedProveedor : proveedor)),
        notification: {
          message: "Proveedor actualizado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo actualizar el proveedor",
          type: "error",
        },
      });
    }
  },

  removeProveedor: async (id) => {
    try {
      await deleteProveedor(id);
      set((state) => ({
        proveedores: state.proveedores.filter((proveedor) => proveedor._id !== id),
        notification: {
          message: "Proveedor eliminado exitosamente",
          type: "success",
        },
      }));
    } catch (error) {
      set({
        notification: {
          message: "No se pudo eliminar el proveedor",
          type: "error",
        },
      });
    }
  },

  setCurrentProveedores: (proveedor) => set({ currentProveedores: proveedor }),
  clearCurrentProveedores: () => set({ currentProveedores: null }),
  clearNotification: () => set({ notification: null }),
}));

export default useProveedorStore;
