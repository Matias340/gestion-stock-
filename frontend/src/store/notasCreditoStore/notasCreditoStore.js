import { create } from "zustand";
import { createNotaCredito } from "../api/api"; // asegurate de ajustar el path según tu estructura

const useNotaCreditoStore = create((set, get) => ({
  clienteId: null,
  productos: [], // [{ productoId, nombre, cantidad, precioUnitario, subtotal }]
  motivo: "",
  observaciones: "",
  procesadoPor: null,
  loading: false,
  error: null,
  successMessage: null,

  setCliente: (clienteId) => set({ clienteId }),
  setProcesadoPor: (userId) => set({ procesadoPor: userId }),
  setMotivo: (motivo) => set({ motivo }),
  setObservaciones: (obs) => set({ observaciones: obs }),

  agregarProducto: (producto) => {
    const productos = get().productos;
    const existente = productos.find((p) => p.productoId === producto.productoId);

    if (existente) {
      const nuevosProductos = productos.map((p) =>
        p.productoId === producto.productoId
          ? {
              ...p,
              cantidad: p.cantidad + producto.cantidad,
              subtotal: (p.cantidad + producto.cantidad) * p.precioUnitario,
            }
          : p
      );
      set({ productos: nuevosProductos });
    } else {
      set({
        productos: [
          ...productos,
          {
            productoId: producto.productoId,
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precioUnitario: producto.precioUnitario,
            subtotal: producto.cantidad * producto.precioUnitario,
          },
        ],
      });
    }
  },

  eliminarProducto: (productoId) => {
    const productos = get().productos.filter((p) => p.productoId !== productoId);
    set({ productos });
  },

  getTotal: () => {
    return get().productos.reduce((acc, p) => acc + p.subtotal, 0);
  },

  reset: () =>
    set({
      clienteId: null,
      productos: [],
      motivo: "",
      observaciones: "",
      procesadoPor: null,
      loading: false,
      error: null,
      successMessage: null,
    }),

  // Enviar al backend
  guardarNotaCredito: async () => {
    const { clienteId, productos, motivo, observaciones, procesadoPor } = get();

    const payload = {
      clienteId,
      productos: productos.map((p) => ({
        productoId: p.productoId,
        cantidad: p.cantidad,
      })),
      motivo,
      observaciones,
      procesadoPor,
    };

    set({ loading: true, error: null, successMessage: null });

    try {
      const res = await createNotaCredito(payload);
      set({ successMessage: res.data.message });
      get().reset(); // opcional: resetea luego de guardar
    } catch (error) {
      set({ error: error.response?.data?.message || "Error al crear la nota de crédito" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useNotaCreditoStore;
