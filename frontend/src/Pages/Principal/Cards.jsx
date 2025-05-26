import React from "react";
import { Fade } from "react-awesome-reveal";
import CierreDeCaja from "../CierreDeCaja/CierreDeCaja";
import Gastos from "../Gastos/Gastos";
import HistorialVentas from "../Historial/HistorialVentas";
import Ingresos from "../Ingresos/Ingresos";
import Productos from "../Productos/Productos";
import Proveedores from "../Proveedores/Proveedores";
import Venta from "../ventas/Venta";

function Cards() {
  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        <Venta />
        <Productos />
        <Proveedores />
        <HistorialVentas />
        <Ingresos />
        <Gastos />
        <CierreDeCaja />
      </div>
    </Fade>
  );
}

export default Cards;
