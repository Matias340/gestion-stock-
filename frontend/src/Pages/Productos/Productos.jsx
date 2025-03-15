import React from "react";
import { Link } from "react-router-dom";
import productImage from "../../assets/productos.png";

function Productos() {
  return (
    <div className="bg-white text-center font-bold text-xl shadow-md p-4 rounded-lg">
      <Link to="/products">
        Productos
        <div className="flex justify-center items-center mt-2">
          <img src={productImage} alt="Producto" className="w-24 h-24" />
        </div>
      </Link>
    </div>
  );
}

export default Productos;
