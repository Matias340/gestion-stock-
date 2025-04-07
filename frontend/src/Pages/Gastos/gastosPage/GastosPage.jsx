import { useState, useEffect } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";
import { ArrowLeft } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

function GastosPage() {
  const { ventaProducts, fetchVentaDetails } = useVentaStore();
  const [filtro, setFiltro] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);

  useEffect(() => {
    fetchVentaDetails();
  }, []);

  useEffect(() => {
    if (!ventaProducts) return;

    let ventasFiltradas = ventaProducts;

    if (filtro === "today") {
      const hoy = new Date();
      ventasFiltradas = ventaProducts.filter((venta) => {
        const fechaVenta = new Date(venta.createdAt);

        return (
          fechaVenta.getDate() === hoy.getDate() &&
          fechaVenta.getMonth() === hoy.getMonth() &&
          fechaVenta.getFullYear() === hoy.getFullYear()
        );
      });
    } else if (filtro === "week") {
      const hoy = new Date();
      const haceUnaSemana = new Date();
      haceUnaSemana.setDate(hoy.getDate() - 7);

      ventasFiltradas = ventaProducts.filter((venta) => {
        const fechaVenta = new Date(venta.createdAt);
        return fechaVenta >= haceUnaSemana && fechaVenta <= hoy;
      });
    }

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

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="max-h-[510px] overflow-y-auto bg-white p-4 shadow-md rounded-md w-full">
          <div className="flex mb-4">
            <Link to="/">
              <ArrowLeft size={35} className="mr-10" />
            </Link>
            <h1 className="text-2xl font-semibold">Historial de Gastos</h1>
          </div>
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
            <span className="text-lg font-bold text-red-600">$0,00</span>
          </div>
          <div className="mt-8 shadow-md rounded-md border border-gray-100">
            <h1 className="font-bold text-xl mb-2 ml-4 mt-2">Agregar Gasto</h1>
            <div className="flex flex-col mt-5 mb-2 ml-4">
              <label className="mb-2 font-bold">Descripción:</label>
              <textarea
                placeholder="Descripción"
                className="pl-2 py-1 mr-4 border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            <div className="flex flex-col mt-2 mb-2 ml-4">
              <label className="mb-2 font-bold">Monto:</label>
              <input
                type="text"
                placeholder="Monto"
                className="pl-2 py-1 w-48 border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex flex-col mt-5">
              <button className="w-48 ml-4 mb-4 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded text-white py-2 font-bold">
                Agregar Gasto
              </button>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
}

export default GastosPage;
