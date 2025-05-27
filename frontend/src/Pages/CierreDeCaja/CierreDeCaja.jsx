import React from "react";
import { Link } from "react-router-dom";
import gastosImage from "../../assets/close.png";

function CierreDeCaja() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/cierre">
        Cierre de Caja
        <div className="flex justify-center items-center mt-2">
          <img src={gastosImage} alt="gastos" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default CierreDeCaja;
