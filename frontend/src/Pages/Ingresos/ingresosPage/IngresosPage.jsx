import { useState, useEffect } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

function IngresosPage({ sales }) {
  const { ventaProducts, fetchVentaDetails } = useVentaStore();
  const [filtro, setFiltro] = useState(""); // Estado para el filtro
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);

  useEffect(() => {
    fetchVentaDetails(); // Carga las ventas al montar el componente
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

  console.log("ventas", ventaProducts);

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
            <h1 className="text-2xl font-semibold">Historial de Ingresos</h1>
          </div>
          {/* Resumen de ingresos */}
          <div className="flex justify-between bg-blue-100 p-3 rounded-md mb-4">
            <span className="text-lg font-bold">Total Ingresos:</span>
            <span className="text-lg font-bold text-blue-600">
              ${totalIngresos}
            </span>
          </div>

          {/* Filtros */}
          <div className="mb-3">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-48 border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Todas las ventas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
            </select>
          </div>

          {/* Tabla de ventas */}
          <div className="">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Fecha</th>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Método de Pago</th>
                  <th className="px-4 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id}>
                    <td className="px-4 py-2 border">{venta.createdAt}</td>
                    <td className="px-4 py-2 border">
                      {venta.products
                        .map((producto) => producto.name)
                        .join(", ")}
                    </td>
                    <td className="px-4 py-2 border">{venta.medioPago}</td>
                    <td className="px-4 py-2 border">{venta.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Fade>
    </>
  );
}

export default IngresosPage;
