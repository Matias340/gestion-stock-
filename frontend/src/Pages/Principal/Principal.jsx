import { useState } from "react";
import { Menu, House, Package, Notebook, ShoppingCart } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

function Principal() {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link to="/">
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
            <div className="flex">
              <Notebook size={24} />
              <p className="text-md ml-5">Historial de Ventas</p>
            </div>
          </Link>
        </nav>
      </div>

      {/* Contenedor principal que se desplaza */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <header className="bg-blue-600 shadow-md text-white p-4 flex items-center transition-all duration-300 ease-in-out">
          <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={28} />
          </button>
          <h1 className="ml-4 text-xl font-bold">Gestión 360</h1>
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
