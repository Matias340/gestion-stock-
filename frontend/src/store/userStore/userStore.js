import { create } from "zustand";
import { registro } from "../../api/apiUsers";

const useUserStore = create((set) => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  return {
    user: storedUser,
  loading: false,
  error: null,
  login: async (usuario, password) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(import.meta.env.VITE_API_USERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: usuario, password }),
      });

      const data = await response.json();

      if (response.ok) {
        set({ user: data.user, loading: false });
        localStorage.setItem("user", JSON.stringify(data.user));
        return true; // Indicar éxito
      } else {
        set({ error: data.message || "Credenciales incorrectas", loading: false });
        return false; // Indicar error
      }
    } catch (error) {
      set({ error: "Error al conectar con el servidor", loading: false });
      return false;
    }
  },
  register: async (user, password) => {
    set({ loading: true, error: null });
    try {
      const response = await registro({ user, password });
      set({ user: response.data, loading: false });
    } catch (error) {
      set({ error: "Error en el registro", loading: false });
    }
  },
  logout: () => set({ user: null }), // Para cerrar sesión
}});

export default useUserStore;