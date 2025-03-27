import { useState, useEffect } from "react";
import useProductStore from "../../../store/productStore/productStore";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BuscadorProductos from "./buscadorProductos";
import ListCartProduct from "./ListCartProduct";
import InformacionProduct from "./InformacionProduct";
import HistorialVentasPorDia from "./HistorialVentasPorDia";

export default function VentaPage() {
  const { fetchProduct } = useProductStore();

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-100 space-y-6">
      <div className="max-h-[540px] overflow-y-auto">
        <div className="flex">
          <Link to="/">
            <ArrowLeft size={35} className="mr-10" />
          </Link>
          <h1 className="text-2xl font-semibold">Facturación</h1>
        </div>
        {/* Escaneo del Código de Barras */}
        <div className="">
          <input
            type="text"
            className="absolute opacity-0 pointer-events-none"
            placeholder="Escanee el código de barras"
            autoFocus
          />
        </div>
        {/* Buscador de los Productos */}
        <div>
          <BuscadorProductos />
        </div>
        <div className="flex justify-between gap-4">
          {/* Tablero de Productos Seleccionados */}
          <div className="w-1/2 overflow-auto">
            <ListCartProduct />
          </div>
          {/* Información del Producto */}
          <div className="w-1/2 overflow-auto">
            <InformacionProduct />
          </div>
        </div>
        <div>
          <HistorialVentasPorDia />
        </div>
      </div>
    </div>
  );
}
