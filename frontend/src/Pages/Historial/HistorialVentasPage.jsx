import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import excel from "../../assets/excel.png";
import pdf from "../../assets/pdf.png";
import useVentaStore from "../../store/ventaStore/ventaStore";

function HistorialVentasPage() {
  const { ventaProducts, fetchVentaDetails } = useVentaStore();

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtro: "all" | "week" | "month"
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchVentaDetails();
  }, []);

  // Filtrar ventas según filtro seleccionado
  const filteredVentas = useMemo(() => {
    if (!ventaProducts) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (filter === "week") {
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - 7);

      return ventaProducts.filter((venta) => {
        const ventaDate = new Date(venta.createdAt);
        return ventaDate >= startOfWeek && ventaDate <= now;
      });
    }

    if (filter === "month") {
      const startOfMonth = new Date(startOfToday);
      startOfMonth.setMonth(startOfToday.getMonth() - 1);

      return ventaProducts.filter((venta) => {
        const ventaDate = new Date(venta.createdAt);
        return ventaDate >= startOfMonth && ventaDate <= now;
      });
    }

    return ventaProducts; // "all"
  }, [ventaProducts, filter]);

  // Calcular las ventas que mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);

  // Exportar PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Ventas", 10, 10);

    const tableColumn = ["Fecha", "Nombre", "Cantidad", "Total"];
    const tableRows = filteredVentas.map((ventaProduct) => [
      new Date(ventaProduct.createdAt).toLocaleString("es-AR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      ventaProduct.products.map((p) => p.name).join(", "),
      ventaProduct.products.map((p) => p.quantity).join(", "),
      `$${ventaProduct.total.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Ventas.pdf");
  };

  // Exportar Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredVentas.map((venta) => ({
        Fecha: new Date(venta.createdAt).toLocaleString("es-AR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        Nombre: venta.products.map((p) => p.name).join(", "),
        Cantidad: venta.products.map((p) => p.quantity).join(", "),
        total: venta.total,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "Ventas.xlsx");
  };

  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="bg-white p-4 rounded-md shadow">
        {/* Encabezado con botón de volver y título */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center">
            <Link to="/home">
              <ArrowLeft size={35} className="mr-4" />
            </Link>
            <h1 className="text-2xl font-semibold">Historial de Ventas</h1>
          </div>
        </div>

        {/* Botones exportar y filtros */}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button onClick={exportToPDF} className="cursor-pointer">
            <img src={pdf} alt="Pdf" className="w-12 h-12 py-1 px-1 rounded-md" />
          </button>
          <button onClick={exportToExcel} className="cursor-pointer">
            <img src={excel} alt="Excel" className="w-12 h-12 py-1 px-1 rounded-md" />
          </button>

          {/* Filtros */}
          <div className="ml-auto flex gap-2">
            <button
              className={`px-4 py-2 cursor-pointer rounded-md font-semibold ${
                filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
            >
              Todas
            </button>
            <button
              className={`px-4 py-2 cursor-pointer rounded-md font-semibold ${
                filter === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => {
                setFilter("week");
                setCurrentPage(1);
              }}
            >
              Última Semana
            </button>
            <button
              className={`px-4 py-2 cursor-pointer rounded-md font-semibold ${
                filter === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => {
                setFilter("month");
                setCurrentPage(1);
              }}
            >
              Último Mes
            </button>
          </div>
        </div>

        {/* Tabla de ventas */}
        {/* Vista de tabla para escritorio */}
        <div className="hidden sm:block mt-4 max-h-[320px] overflow-y-auto overflow-x-auto">
          {filteredVentas.length === 0 ? (
            <p className="text-gray-500 text-center">No hay ventas registradas.</p>
          ) : (
            <table className="min-w-full border border-gray-300 rounded-md text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-center">Cantidad</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentVentas.map((venta) => (
                  <tr key={venta._id} className="border-t border-gray-300 hover:bg-gray-100">
                    <td className="p-2">
                      {new Date(venta.createdAt).toLocaleString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-2 truncate max-w-xs">{venta.products.map((p) => p.name).join(", ")}</td>
                    <td className="p-2 text-center">{venta.products.reduce((acc, p) => acc + p.quantity, 0)}</td>
                    <td className="p-2 text-right font-bold">
                      $
                      {venta.total.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Vista de tarjetas para móviles */}
        <div className="sm:hidden mt-4 max-h-[320px] overflow-y-auto flex flex-col gap-4 pr-2">
          {filteredVentas.length === 0 ? (
            <p className="text-gray-500 text-center">No hay ventas registradas.</p>
          ) : (
            currentVentas.map((venta) => (
              <div key={venta._id} className="bg-white rounded shadow p-4 border border-gray-300 text-sm">
                <p>
                  <span className="font-semibold">Fecha:</span>
                  <br />
                  {new Date(venta.createdAt).toLocaleString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Productos:</span>
                  <br />
                  {venta.products.map((p) => p.name).join(", ")}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Cantidad total:</span>{" "}
                  {venta.products.reduce((acc, p) => acc + p.quantity, 0)}
                </p>
                <p className="mt-2 font-bold text-right text-green-700">
                  Total: $
                  {venta.total.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 cursor-pointer rounded bg-blue-600 font-bold text-white disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 cursor-pointer rounded bg-blue-500 font-bold text-white disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </Fade>
  );
}

export default HistorialVentasPage;
