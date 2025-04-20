import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGastoStore from "../../../store/gastoStore/GastoStore";
import EliminarPorFecha from "./EliminarPorFecha";

function HistorialGastos() {
  const { gastos, removeGasto, setCurrentGasto } = useGastoStore();
  const [showModal, setShowModal] = useState(false);
  const [gastosToDelete, setGastosToDelete] = useState([]);
  const [gastoToDelete, setGastoToDelete] = useState(null);

  const navigate = useNavigate();

  const handleDeleteClick = (gasto) => {
    setGastoToDelete(gasto);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (gastoToDelete) {
      // Eliminación individual
      removeGasto(gastoToDelete._id);
    } else if (gastosToDelete.length > 0) {
      // Eliminación masiva
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

  return (
    <div className="relative overflow-x-auto mt-5">
      <h1 className="font-bold mt-2 mb-2">Historial de Gastos</h1>
      <EliminarPorFecha
        onDeleteByRange={(gastosFiltrados) => {
          setGastosToDelete(gastosFiltrados);
          setShowModal(true);
        }}
      />
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-white uppercase bg-blue-500">
          <tr>
            <th scope="col" className="px-4 py-2">
              Fecha
            </th>
            <th scope="col" className="px-4 py-2">
              Descripción
            </th>
            <th scope="col" className="px-4 py-2">
              Monto
            </th>
            <th scope="col" className="px-4 py-2 text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr className="bg-white border-b border-gray-200" key={gasto.id}>
              <th
                scope="row"
                className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {new Date(gasto.createdAt).toLocaleString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </th>
              <td className="px-4 py-2">{gasto.description}</td>
              <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                {gasto.monto}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className="px-4 py-1 rounded-sm font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  onClick={() => {
                    setCurrentGasto(gasto);
                    navigate(`/editarGasto/${gasto._id}`);
                  }}
                >
                  Editar
                </button>
                <button
                  className="ml-2 px-4 py-1 rounded-sm font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  onClick={() => {
                    handleDeleteClick(gasto);
                    setShowModal(true);
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              ¿Seguro que quieres eliminar{" "}
              {gastoToDelete ? "este gasto" : "estos gastos"}?
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

export default HistorialGastos;
