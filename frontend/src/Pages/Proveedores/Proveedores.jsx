import React from "react";
import { Link } from "react-router-dom";
import proveedorImage from "../../assets/proveedor.png";

function Proveedores() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/proveedores">
        Proveedores
        <div className="flex justify-center items-center mt-2">
          <img src={proveedorImage} alt="Producto" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default Proveedores;
