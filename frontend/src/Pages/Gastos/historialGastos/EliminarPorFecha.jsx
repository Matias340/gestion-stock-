import { useState } from "react";
import useGastoStore from "../../../store/gastoStore/GastoStore";
import ExportarTabla from "./ExportarTabla";

function EliminarPorFecha({ onDeleteByRange }) {
  const [gastosToDelete, setGastosToDelete] = useState([]);
  const { gastos } = useGastoStore();

  const handleDeleteByDate = (range) => {
    const now = new Date();
    let filteredGastos = [];

    if (range === "day") {
      filteredGastos = gastos.filter((gasto) => {
        const gastoDate = new Date(gasto.createdAt);
        return (
          gastoDate.getDate() === now.getDate() &&
          gastoDate.getMonth() === now.getMonth() &&
          gastoDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (range === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      filteredGastos = gastos.filter((gasto) => new Date(gasto.createdAt) >= lastWeek);
    } else if (range === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      filteredGastos = gastos.filter((gasto) => new Date(gasto.createdAt) >= lastMonth);
    }

    if (filteredGastos.length > 0) {
      onDeleteByRange(filteredGastos); // se lo pasa a HistorialGastos
    } else {
      alert("No hay gastos en este período.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          className="w-full sm:w-auto px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
          onClick={() => handleDeleteByDate("day")}
        >
          Eliminar Gastos de Hoy
        </button>
        <button
          className="w-full sm:w-auto px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
          onClick={() => handleDeleteByDate("week")}
        >
          Eliminar Gastos de la Última Semana
        </button>
        <button
          className="w-full sm:w-auto px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
          onClick={() => handleDeleteByDate("month")}
        >
          Eliminar Gastos del Último Mes
        </button>
      </div>

      <ExportarTabla />
    </div>
  );
}

export default EliminarPorFecha;
