import { useState, useEffect } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";

function historialVentasPorDia() {
  const [salesToDelete, setSalesToDelete] = useState(null);
  const [ventasToDelete, setVentasToDelete] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const {
    ventaProducts,
    fetchVentaDetails,
    removeSales,
    mostrarHistorial,
    toggleHistorial,
  } = useVentaStore();

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
      filteredSales = ventaProducts.filter(
        (ventaProduct) => new Date(ventaProduct.createdAt) >= lastWeek
      );
    } else if (range === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      filteredSales = ventaProducts.filter(
        (ventaProduct) => new Date(ventaProduct.createdAt) >= lastMonth
      );
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
        <div className="space-y-4 mt-4">
          <div className="flex gap-2 mb-4">
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
                <div className="grid grid-cols-3 font-bold mb-2">
                  <h2 className="text-md">Producto/s:</h2>
                  <h2 className="text-md text-center">Cantidad:</h2>
                  <h2 className="text-md text-right">Precio:</h2>
                </div>

                {/* 🔹 Lista de productos */}
                <div className="space-y-2">
                  {venta.products.map((product) => (
                    <div
                      key={product._id}
                      className="grid grid-cols-3 bg-gray-100 p-2 rounded-md"
                    >
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-gray-700 text-center">
                        x{product.quantity}
                      </span>
                      <span className="font-bold text-right">
                        ${product.quantity * product.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 🔹 Total de la venta */}
                <div className="mt-3 text-right font-bold text-lg">
                  Total: $
                  {venta.total.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || ""}
                </div>
                <button
                  className="px-4 py-2 text-sm font-bold border border-red-500 rounded bg-red-500 text-white cursor-pointer"
                  onClick={() => {
                    handleDeleteClick(venta);
                    setShowModal(true);
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No hay ventas registradas.
            </p>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              ¿Seguro que quieres eliminar{" "}
              {salesToDelete ? "esta venta" : "estas ventas"}?
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
