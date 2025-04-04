import { useState, useEffect } from "react";
import useVentaStore from "../../store/ventaStore/ventaStore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal";

function HistorialVentasPage() {
  const { ventaProducts, fetchVentaDetails, mostrarHistorial } =
    useVentaStore();
  const [ventasOrdenadas, setVentasOrdenadas] = useState([]);

  useEffect(() => {
    fetchVentaDetails();
  }, []);

  useEffect(() => {
    if (ventaProducts.length > 0) {
      const ventasPorMes = {};

      ventaProducts.forEach((venta) => {
        const fecha = new Date(venta.createdAt);
        const mesAno = fecha.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        if (!ventasPorMes[mesAno]) {
          ventasPorMes[mesAno] = [];
        }
        ventasPorMes[mesAno].push(venta);
      });

      setVentasOrdenadas(Object.entries(ventasPorMes));
    }
  }, [ventaProducts]);

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="bg-white p-4 rounded-md shadow">
          <div className="flex justify-between items-center">
            <div className="flex">
              <Link to="/">
                <ArrowLeft size={35} className="mr-10" />
              </Link>
              <h1 className="text-2xl font-semibold">Historial de Ventas</h1>
            </div>
          </div>
          {mostrarHistorial && (
            <div className="mt-4 max-h-[450px] overflow-y-auto">
              {ventasOrdenadas.length > 0 ? (
                ventasOrdenadas.map(([mesAno, ventas]) => (
                  <div key={mesAno}>
                    <h2 className="text-lg font-bold bg-gray-200 p-2 rounded-md">
                      {mesAno}
                    </h2>
                    <ul className="divide-y divide-gray-300">
                      {ventas.map((venta) => (
                        <li key={venta._id} className="py-3 px-2">
                          <div className="text-sm text-gray-500 mb-3">
                            📅 {new Date(venta.createdAt).toLocaleDateString()}
                          </div>
                          <div className="grid grid-cols-3 gap-72 text-left">
                            <span className="font-semibold">
                              {venta.products.map((p) => p.name).join(", ")}
                            </span>
                            <span className="text-gray-700">
                              x
                              {venta.products.reduce(
                                (acc, p) => acc + p.quantity,
                                0
                              )}
                            </span>
                            <span className="font-bold">
                              $
                              {venta.total.toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || ""}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
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
      </Fade>
    </>
  );
}

export default HistorialVentasPage;
