import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGastoStore from "../../../store/gastoStore/GastoStore";
import EliminarPorFecha from "./EliminarPorFecha";

function HistorialGastos() {
  const { gastos, removeGasto, setCurrentGasto } = useGastoStore();
  const [showModal, setShowModal] = useState(false);
  const [gastosToDelete, setGastosToDelete] = useState([]);
  const [gastoToDelete, setGastoToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const handleDeleteClick = (gasto) => {
    setGastoToDelete(gasto);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (gastoToDelete) {
      removeGasto(gastoToDelete._id);
    } else if (gastosToDelete.length > 0) {
      gastosToDelete.forEach((gasto) => removeGasto(gasto._id));
      setGastosToDelete([]);
    }

    setShowModal(false);
    setGastoToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setGastoToDelete(null);
  };

  // Paginación
  const totalPages = Math.ceil(gastos.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentGastos = gastos.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="relative overflow-x-auto mt-5">
      <h1 className="font-bold text-lg md:text-xl mt-2 mb-2">Historial de Gastos</h1>

      <EliminarPorFecha
        onDeleteByRange={(gastosFiltrados) => {
          setGastosToDelete(gastosFiltrados);
          setShowModal(true);
        }}
      />

      <div className="w-full overflow-x-auto">
        {/* Vista tipo tabla en escritorio */}
        <div className="hidden sm:block max-h-[320px] overflow-y-auto overflow-x-auto mt-4">
          <table className="min-w-full text-xs md:text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-blue-500">
              <tr>
                <th className="px-2 md:px-4 py-2">Fecha</th>
                <th className="px-2 md:px-4 py-2">Descripción</th>
                <th className="px-2 md:px-4 py-2">Monto</th>
                <th className="px-2 md:px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentGastos.map((gasto) => (
                <tr className="bg-white border-b border-gray-200" key={gasto._id}>
                  <th className="px-2 md:px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(gasto.createdAt).toLocaleString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </th>
                  <td className="px-2 md:px-4 py-2">{gasto.description}</td>
                  <td className="px-2 md:px-4 py-2 font-medium text-gray-900 whitespace-nowrap">${gasto.monto}</td>
                  <td className="px-2 md:px-4 py-2 text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      <button
                        className="w-full sm:w-auto cursor-pointer px-4 py-1 rounded font-bold bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          setCurrentGasto(gasto);
                          navigate(`/editarGasto/${gasto._id}`);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="w-full sm:w-auto px-4 cursor-pointer py-1 rounded font-bold bg-red-600 text-white hover:bg-red-700"
                        onClick={() => handleDeleteClick(gasto)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista tipo tarjetas en móviles */}
        <div className="sm:hidden mt-4 max-h-[320px] overflow-y-auto flex flex-col gap-4 pr-2">
          {currentGastos.map((gasto) => (
            <div key={gasto._id} className="bg-white border border-gray-300 rounded shadow p-4 text-sm">
              <p>
                <span className="font-semibold">Fecha:</span>
                <br />
                {new Date(gasto.createdAt).toLocaleString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Descripción:</span>
                <br />
                {gasto.description}
              </p>
              <p className="mt-2 font-semibold text-green-700">Monto: ${gasto.monto}</p>
              <div className="flex flex-col gap-2 mt-3">
                <button
                  className="w-full px-4 py-1 rounded font-bold bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setCurrentGasto(gasto);
                    navigate(`/editarGasto/${gasto._id}`);
                  }}
                >
                  Editar
                </button>
                <button
                  className="w-full px-4 py-1 rounded font-bold bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleDeleteClick(gasto)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de paginación */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 cursor-pointer bg-blue-600 font-bold text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 cursor-pointer bg-blue-500 font-bold text-white rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-base md:text-lg font-semibold mb-4">
              ¿Seguro que quieres eliminar {gastoToDelete ? "este gasto" : "estos gastos"}?
            </h3>
            <div className="flex justify-between gap-4">
              <button
                className="flex-1 px-4 py-2 cursor-pointer text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-600"
                onClick={confirmDelete}
              >
                Aceptar
              </button>
              <button
                className="flex-1 px-4 py-2 cursor-pointer text-sm font-bold text-white bg-red-500 rounded hover:bg-red-600"
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

export default HistorialGastos;
