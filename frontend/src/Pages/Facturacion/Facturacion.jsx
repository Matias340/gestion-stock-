import React from "react";
import { Link } from "react-router-dom";
import FacturaImage from "../../assets/factura.png";

const Facturacion = () => {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/facturacion">
        Facturación
        <div className="flex justify-center items-center mt-2">
          <img src={FacturaImage} alt="Producto" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
};

export default Facturacion;
