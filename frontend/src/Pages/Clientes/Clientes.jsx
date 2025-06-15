import React from "react";
import { Link } from "react-router-dom";
import ClientesImage from "../../assets/segmento-de-clientes.png";

function Clientes() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/clientes">
        Clientes
        <div className="flex justify-center items-center mt-2">
          <img src={ClientesImage} alt="Producto" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default Clientes;
