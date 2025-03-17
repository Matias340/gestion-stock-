import { useState, useEffect } from "react";
import useProductStore from "../../../store/productStore/productStore";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BuscadorProductos from "./buscadorProductos";
import ListCartProduct from "./ListCartProduct";
import InformacionProduct from "./InformacionProduct";

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
          <ListCartProduct />

          {/* Información del Producto */}
          <InformacionProduct />
        </div>

        {/* Historial de Ventas */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="text-xl font-bold mb-4">
            Historial de Ventas del Día
          </h3>
          <div className="max-h-60 overflow-y-auto rounded-sm">
            <table className="w-full border-collapse">
              <thead className="text-center">
                <tr className="bg-blue-600 rounded-md">
                  <th className="p-2 border border-blue-600 text-white">
                    Código
                  </th>
                  <th className="p-2 border border-blue-600 text-white">
                    Producto
                  </th>
                  <th className="p-2 border border-blue-600 text-white">
                    Cantidad
                  </th>
                  <th className="p-2 border border-blue-600 text-white">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* Aquí se llenará el historial de ventas */}
                <tr className="border border-gray-200 odd:bg-gray-200 even:bg-white">
                  <td className="p-2 font-bold">ABC123</td>
                  <td className="p-2 font-bold">Ejemplo Producto</td>
                  <td className="p-2 font-bold">2</td>
                  <td className="p-2 font-bold">$1000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
