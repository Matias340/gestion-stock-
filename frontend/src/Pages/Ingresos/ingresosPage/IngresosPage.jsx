import { useState, useEffect } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

function IngresosPage() {
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
              $
              {totalIngresos.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || ""}
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
          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-white uppercase">
                <tr className="bg-blue-500">
                  <th scope="col" className="px-4 py-2">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Método de Pago
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr class="bg-white border-b border-gray-200" key={venta.id}>
                    <th
                      scope="row"
                      class="pl-2 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {new Date(venta.createdAt).toLocaleString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </th>
                    <td className="px-4 py-2">
                      <div
                        className={`flex ${
                          venta.products.length > 3
                            ? "flex-col"
                            : "flex-wrap gap-2"
                        }`}
                      >
                        {venta.products.map((producto, index) => (
                          <span key={index} className="whitespace-nowrap">
                            {producto.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">{venta.medioPago}</td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {venta.total.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || ""}
                    </td>
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
