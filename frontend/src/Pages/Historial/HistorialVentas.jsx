import React from "react";
import { Link } from "react-router-dom";
import libroImage from "../../assets/libro.png";

function HistorialVentas() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/historial">
        Historial de Ventas
        <div className="flex justify-center items-center mt-2">
          <img src={libroImage} alt="historial" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default HistorialVentas;
