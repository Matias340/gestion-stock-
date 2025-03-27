import { useState, useEffect } from "react";
import useVentaStore from "../../store/ventaStore/ventaStore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function HistorialVentasPage() {
  const { ventaProducts, fetchVentaDetails, mostrarHistorial } =
    useVentaStore();

  useEffect(() => {
    fetchVentaDetails();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="flex justify-between items-center">
        <div className="flex">
          <Link to="/">
            <ArrowLeft size={35} className="mr-10" />
          </Link>
          <h1 className="text-2xl font-semibold">Historial de Ventas</h1>
        </div>
      </div>

      {mostrarHistorial && (
        <div className="space-y-4 mt-4">
          {ventaProducts.length > 0 ? (
            ventaProducts.map((venta) => (
              <div
                key={venta._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div>
                  <div className="flex justify-between">
                    <div className="text-sm mb-4 text-gray-500">
                      📅 {new Date(venta.createdAt).toLocaleString()}
                    </div>
                  </div>
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
                      <span className="text-gray-700">x{product.quantity}</span>
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
      )}
    </div>
  );
}

export default HistorialVentasPage;
