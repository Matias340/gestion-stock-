import { useState, useEffect } from "react";
import useGastoStore from "../../../store/gastoStore/GastoStore";
import useVentaStore from "../../../store/ventaStore/ventaStore";

function ComponenteTotales() {
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [gananciaTotal, setGananciaTotal] = useState(0);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const { ventaProducts, fetchVentaDetails } = useVentaStore();
  const { gastos, fetchGasto } = useGastoStore();

  useEffect(() => {
    fetchVentaDetails();
    fetchGasto();
  }, []);

  useEffect(() => {
    if (!ventaProducts) return;

    let ventasFiltradas = ventaProducts;

    setVentasFiltradas(ventasFiltradas);
  }, [filtro, ventaProducts]);

  useEffect(() => {
    if (ventasFiltradas.length > 0) {
      let total = ventasFiltradas.reduce(
        (sum, venta) => sum + (Number(venta.total) || 0),
        0
      );
      setTotalIngresos(total);
    } else {
      setTotalIngresos(0); // Evita NaN si no hay ventas
    }
  }, [ventasFiltradas]);

  useEffect(() => {
    if (gastos?.length > 0) {
      const total = gastos.reduce(
        (sum, gasto) => sum + (Number(gasto.monto) || 0),
        0
      );
      setTotalGastos(total);
    } else {
      setTotalGastos(0); // Evita NaN si no hay gastos
    }
  }, [gastos]);

  useEffect(() => {
    setGananciaTotal(totalIngresos - totalGastos);
  }, [totalIngresos, totalGastos]);

  return (
    <div>
      <div className="flex justify-between bg-blue-100 p-3 rounded-md mb-4">
        <span className="text-lg font-bold">Total Ingresos:</span>
        <span className="text-lg font-bold text-blue-600">
          $
          {totalIngresos.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || ""}
        </span>
      </div>
      <div className="flex justify-between bg-red-100 p-3 rounded-md mb-4">
        <span className="text-lg font-bold">Total Gastos:</span>
        <span className="text-lg font-bold text-red-600">
          $
          {totalGastos.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || ""}
        </span>
      </div>
      <div className="flex justify-between bg-green-100 p-3 rounded-md mb-4">
        <span className="text-lg font-bold">Total:</span>
        <span
          className={`text-lg font-bold ${
            gananciaTotal >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          $
          {gananciaTotal.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || ""}
        </span>
      </div>
    </div>
  );
}

export default ComponenteTotales;
