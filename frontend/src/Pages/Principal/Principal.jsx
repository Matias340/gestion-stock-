import {
  BanknoteIcon,
  Contact,
  ExternalLinkIcon,
  EyeClosed,
  House,
  LogOut,
  Menu,
  Notebook,
  Package,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/userStore/userStore";

function Principal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUserStore();
  const [usuario, setUsuario] = useState(null);

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
        className={`fixed top-0 left-0 z-50 h-full bg-gray-800 text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end px-4 mt-2">
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300 cursor-pointer">
            ✕
          </button>
        </div>
        <h2 className="text-gray-300 mt-1 ml-3 font-bold">Tienda</h2>
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
          <Link to="/proveedores">
            <div className="flex mb-5">
              <Truck size={24} />
              <p className="text-md ml-5">Proveedores</p>
            </div>
          </Link>
          <Link to="/clientes">
            <div className="flex mb-5">
              <Contact size={24} />
              <p className="text-md ml-5">Clientes</p>
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
            <div className="flex mb-5">
              <EyeClosed size={24} />
              <p className="text-md ml-5">Cierre De Caja</p>
            </div>
          </Link>
          <Link to="/acerca">
            <div className="flex mb-5">
              <Search size={24} />
              <p className="text-md ml-5">Acerca De</p>
            </div>
          </Link>
          {user && (
            <div className="w-full flex md:w-auto">
              <LogOut size={24} />
              <button onClick={handleLogout} className="text-md ml-5 cursor-pointer">
                Cerrar sesión
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Contenedor principal que se desplaza */}
      <div className="flex-1 min-h-screen transition-all duration-300 ease-in-out">
        {/* Navbar */}
        <header className="bg-blue-600 shadow-md text-white px-4 py-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-all duration-300 ease-in-out">
          {/* Fila superior: Gestión 360 y Bienvenido */}
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button className="cursor-pointer p-2 sm:p-3 md:p-4" onClick={() => setIsOpen(!isOpen)}>
                <Menu className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6" />
              </button>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap">Gestión 360</h1>
            </div>

            <h1 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap mr-10">
              Bienvenido {usuario ? usuario.nombre : "Invitado"}
            </h1>
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
