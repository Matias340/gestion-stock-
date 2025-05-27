import { BanknoteIcon, ExternalLinkIcon, EyeClosed, House, Menu, Notebook, Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/userStore/userStore";

function Principal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUserStore();
  const [usuario, setUsuario] = useState(null);
  console.log(user);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser)); // Convertir de string a objeto
    }
  }, []);

  const handleLogout = () => {
    logout(); // Esto borra el estado del usuario en el store
    toast.success("Sesión cerrada correctamente");
    navigate("/"); // Redirige a la página de login
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-all duration-300 ease-in-out`}
      >
        <h2 className="text-gray-300 mt-4 ml-3 font-bold">Tienda</h2>
        <nav className="p-4 font-bold">
          <Link to="/home">
            <div className="flex mb-5 mt-5">
              <House size={24} />
              <p className="text-md ml-5">Inicio</p>
            </div>
          </Link>
          <Link to="/products">
            <div className="flex mb-5">
              <Package size={24} />
              <p className="text-md ml-5">Productos</p>
            </div>
          </Link>
          <Link to="/vender">
            <div className="flex mb-5">
              <ShoppingCart size={24} />
              <p className="text-md ml-5">Vender</p>
            </div>
          </Link>
          <Link to="/historial">
            <div className="flex mb-5">
              <Notebook size={24} />
              <p className="text-md ml-5">Historial de Ventas</p>
            </div>
          </Link>
          <Link to="/ingresos">
            <div className="flex mb-5">
              <BanknoteIcon size={24} />
              <p className="text-md ml-5">Ingresos</p>
            </div>
          </Link>
          <Link to="/gastos">
            <div className="flex mb-5">
              <ExternalLinkIcon size={24} />
              <p className="text-md ml-5">Gastos</p>
            </div>
          </Link>
          <Link to="/cierre">
            <div className="flex">
              <EyeClosed size={24} />
              <p className="text-md ml-5">Cierre De Caja</p>
            </div>
          </Link>
        </nav>
      </div>

      {/* Contenedor principal que se desplaza */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${isOpen ? "ml-64" : "ml-0"}`}>
        {/* Navbar */}
        <header className="bg-blue-600 shadow-md text-white p-4 flex items-center justify-between transition-all duration-300 ease-in-out">
          {/* Lado izquierdo: botón menú y título */}
          <div className="flex items-center">
            <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <Menu size={28} />
            </button>
            <h1 className="ml-4 text-xl font-bold">Gestión 360</h1>
          </div>

          {/* Lado derecho: bienvenida y botón de cerrar sesión */}
          <div className="flex items-center gap-4">
            <h1 className="font-bold">Bienvenido {usuario ? usuario.nombre : "Invitado"}</h1>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 font-bold cursor-pointer px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </header>

        <div className="w-full overflow-hidden">
          {/* Contenido principal */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Principal;
