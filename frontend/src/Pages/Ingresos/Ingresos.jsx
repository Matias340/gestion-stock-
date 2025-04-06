import React from "react";
import { Link } from "react-router-dom";
import ingresosImage from "../../assets/moneda.png";

function Ingresos() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/ingresos">
        Ingresos
        <div className="flex justify-center items-center mt-2">
          <img src={ingresosImage} alt="Ingresos" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default Ingresos;
