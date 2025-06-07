import React, { useEffect, useState } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";

function historialVentasPorDia() {
  const [salesToDelete, setSalesToDelete] = useState(null);
  const [ventasToDelete, setVentasToDelete] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { ventaProducts, fetchVentaDetails, removeSales, mostrarHistorial, toggleHistorial } = useVentaStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcular índices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVentas = ventaProducts.slice(startIndex, endIndex);

  // Total de páginas
  const totalPages = Math.ceil(ventaProducts.length / itemsPerPage);

  useEffect(() => {
    fetchVentaDetails();
  }, []);

  const handleDeleteClick = (product) => {
    setSalesToDelete(product);
    setShowModal(true);
  };

  const handleDeleteByDate = (range) => {
    const now = new Date();
    let filteredSales = [];

    if (range === "day") {
      filteredSales = ventaProducts.filter((ventaProduct) => {
        const ventaDate = new Date(ventaProduct.createdAt);
        return (
          ventaDate.getDate() === now.getDate() &&
          ventaDate.getMonth() === now.getMonth() &&
          ventaDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (range === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      filteredSales = ventaProducts.filter((ventaProduct) => new Date(ventaProduct.createdAt) >= lastWeek);
    } else if (range === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      filteredSales = ventaProducts.filter((ventaProduct) => new Date(ventaProduct.createdAt) >= lastMonth);
    }

    if (filteredSales.length > 0) {
      setVentasToDelete(filteredSales); // Guardar gastos a eliminar
      setShowModal(true);
    } else {
      alert("No hay ventas en este período.");
    }
  };

  // Función para confirmar la eliminación
  const confirmDelete = () => {
    if (salesToDelete) {
      // Eliminación individual
      removeSales(salesToDelete._id);
    } else if (ventasToDelete.length > 0) {
      // Eliminación masiva
      ventasToDelete.forEach((venta) => removeSales(venta._id));
      setVentasToDelete([]);
    }

    setShowModal(false);
    setSalesToDelete(null);
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setShowModal(false);
    setSalesToDelete(null);
  };

  return (
    <div className="bg-white mt-2 p-4 rounded-md shadow-lg ">
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
        <div className="mt-4">
          {/* Botones de eliminación por fecha */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <button
              className="px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
              onClick={() => handleDeleteByDate("day")}
            >
              Eliminar Historial de Hoy
            </button>
            <button
              className="px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
              onClick={() => handleDeleteByDate("week")}
            >
              Eliminar Historial de la Última Semana
            </button>
            <button
              className="px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
              onClick={() => handleDeleteByDate("month")}
            >
              Eliminar Historial del Último Mes
            </button>
          </div>

          {ventaProducts.length > 0 ? (
            <>
              {/* Vista en pantallas medianas o grandes */}
              <div className="hidden md:block">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="text-left px-4 py-2">Fecha</th>
                      <th className="text-left px-4 py-2">Producto/s</th>
                      <th className="text-center px-4 py-2">Cantidad</th>
                      <th className="text-right px-4 py-2">Precio Total</th>
                      <th className="text-center px-4 py-2">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVentas.map((venta) => (
                      <React.Fragment key={venta._id}>
                        {venta.products.map((product, idx) => (
                          <tr key={product._id + idx} className="border-t border-gray-200">
                            {idx === 0 && (
                              <td rowSpan={venta.products.length} className="text-sm text-gray-500 px-4 py-2 align-top">
                                {new Date(venta.createdAt).toLocaleString()}
                              </td>
                            )}
                            <td className="px-4 py-2">{product.name}</td>
                            <td className="text-center px-4 py-2">x{product.quantity}</td>
                            <td className="text-right px-4 py-2">${product.quantity * product.price}</td>
                            {idx === 0 && (
                              <td rowSpan={venta.products.length} className="px-4 py-2 text-center align-top">
                                <div className="mb-2 font-bold">Total: ${venta.total.toFixed(2)}</div>
                                <button
                                  className="px-3 py-1 text-sm font-bold border border-red-500 rounded bg-red-500 text-white"
                                  onClick={() => {
                                    handleDeleteClick(venta);
                                    setShowModal(true);
                                  }}
                                >
                                  Eliminar
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista para móviles */}
              <div className="block md:hidden space-y-4">
                {currentVentas.map((venta) => (
                  <div key={venta._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">📅 {new Date(venta.createdAt).toLocaleString()}</div>

                    {venta.products.map((product) => (
                      <div key={product._id} className="bg-gray-100 rounded-md p-2 mb-2">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm">Cantidad: x{product.quantity}</div>
                        <div className="text-sm">Precio total: ${product.quantity * product.price}</div>
                      </div>
                    ))}

                    <div className="text-right font-bold text-lg mt-2">Total: ${venta.total.toFixed(2)}</div>

                    <button
                      className="mt-2 w-full px-4 py-2 text-sm font-bold border border-red-500 rounded bg-red-500 text-white"
                      onClick={() => {
                        handleDeleteClick(venta);
                        setShowModal(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  className="px-3 py-1 cursor-pointer rounded border text-sm font-medium"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ⬅️ Anterior
                </button>
                <span className="text-sm font-medium mt-1">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="px-3 py-1 cursor-pointer rounded border text-sm font-medium"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Siguiente ➡️
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">No hay ventas registradas.</p>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              ¿Seguro que quieres eliminar {salesToDelete ? "esta venta" : "estas ventas"}?
            </h3>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 text-sm font-bold text-white bg-blue-500 cursor-pointer rounded"
                onClick={confirmDelete}
              >
                Aceptar
              </button>
              <button
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 cursor-pointer rounded"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default historialVentasPorDia;
