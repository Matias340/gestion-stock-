import React from "react";
import { Fade } from "react-awesome-reveal";
import CierreDeCaja from "../CierreDeCaja/CierreDeCaja";
import Clientes from "../Clientes/Clientes";
import Gastos from "../Gastos/Gastos";
import HistorialVentas from "../Historial/HistorialVentas";
import Ingresos from "../Ingresos/Ingresos";
import Productos from "../Productos/Productos";
import Proveedores from "../Proveedores/Proveedores";
import Venta from "../ventas/Venta";

function Cards() {
  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="max-h-[90vh] overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Venta />
          <Productos />
          <Proveedores />
          <Clientes />
          <HistorialVentas />
          <Ingresos />
          <Gastos />
          <CierreDeCaja />
        </div>
      </div>
    </Fade>
  );
}

export default Cards;
