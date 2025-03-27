import React from "react";
import HistorialVentas from "../Historial/HistorialVentas";
import Productos from "../Productos/Productos";
import Venta from "../ventas/Venta";

function Home() {
  return (
    <div>
      <h1 className="text-center text-white font-bold text-2xl bg-blue-500 pt-3 pb-3">
        Gestion 360
      </h1>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        <Venta />
        <Productos />
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2>Ingresos</h2>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2>Gastos</h2>
        </div>
        <HistorialVentas />
      </div>
    </div>
  );
}

export default Home;
