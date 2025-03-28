import React from "react";
import HistorialVentas from "../Historial/HistorialVentas";
import Productos from "../Productos/Productos";
import Proveedores from "../Proveedores/Proveedores";
import Venta from "../ventas/Venta";

function Cards() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      <Venta />
      <Productos />
      <Proveedores />
      <HistorialVentas />
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2>Ingresos</h2>
      </div>
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2>Gastos</h2>
      </div>
    </div>
  );
}

export default Cards;
