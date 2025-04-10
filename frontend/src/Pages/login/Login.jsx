import { useState } from "react";
import useUserStore from "../../store/userStore/userStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, user, loading, error } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await login(usuario, password);
      console.log("Respuesta del login:", success);

      if (success) {
        toast.success("Inicio de sesión exitoso");
        navigate("/home");
      } else {
        toast.error("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión, intenta nuevamente");
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default Login;
