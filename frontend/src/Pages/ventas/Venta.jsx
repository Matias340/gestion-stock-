import React from "react";
import { Link } from "react-router-dom";
import ventaImage from "../../assets/venta.png";

function Venta() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/venta">
        Ventas
        <div className="flex justify-center items-center mt-2">
          <img src={ventaImage} alt="Venta" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default Venta;
