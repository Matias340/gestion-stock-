import { useState, useEffect } from "react";
import useProductStore from "../../../store/productStore/productStore";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BuscadorProductos from "./buscadorProductos";
import ListCartProduct from "./ListCartProduct";
import InformacionProduct from "./InformacionProduct";

export default function VentaPage() {
  const { fetchProduct, fetchVentaDetails, ventaProducts } = useProductStore();

  useEffect(() => {
    fetchProduct();
    fetchVentaDetails();
  }, []);

  console.log("venta", ventaProducts);

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
          <div className="space-y-4">
            {ventaProducts.length > 0 ? (
              ventaProducts.map((venta) => (
                <div
                  key={venta._id}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                >
                  <div className="text-sm mb-4 text-gray-500">
                    📅 {new Date(venta.createdAt).toLocaleString()}
                  </div>
                  {/* 🔹 Encabezado de la venta */}
                  <div className="flex justify-between">
                    <h2 className="text-md font-bold mb-2">Producto/s:</h2>
                    <h2 className="text-md font-bold mb-2">Cantidad:</h2>
                    <h2 className="text-md font-bold mb-2">Precio:</h2>
                  </div>
                  {/* 🔹 Lista de productos */}
                  <div className="space-y-2">
                    {venta.products.map((product) => (
                      <div
                        key={product._id}
                        className="flex justify-between bg-gray-100 p-2 rounded-md"
                      >
                        <span className="font-semibold">{product.name}</span>
                        <span className="text-gray-700">
                          x{product.quantity}
                        </span>
                        <span className="font-bold">
                          ${product.quantity * product.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 🔹 Total de la venta */}
                  <div className="mt-3 text-right font-bold text-lg">
                    Total: ${venta.total}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No hay ventas registradas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
