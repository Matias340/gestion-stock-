import { useState, useEffect } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";

function historialVentasPorDia() {
  const {
    ventaProducts,
    fetchVentaDetails,
    mostrarHistorial,
    toggleHistorial,
  } = useVentaStore();

  useEffect(() => {
    fetchVentaDetails();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Historial de Ventas del Día</h3>
        <button
          onClick={toggleHistorial}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer font-bold text-white rounded-md"
        >
          {mostrarHistorial ? "Ocultar" : "Mostrar"}
        </button>
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

export default historialVentasPorDia;
