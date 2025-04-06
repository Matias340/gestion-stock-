import React from "react";
import { Link } from "react-router-dom";
import gastosImage from "../../assets/gasto.png";

function Gastos() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/gastos">
        Gastos
        <div className="flex justify-center items-center mt-2">
          <img src={gastosImage} alt="gastos" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default Gastos;
