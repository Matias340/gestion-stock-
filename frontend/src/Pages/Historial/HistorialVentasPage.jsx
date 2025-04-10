import { useState, useEffect } from "react";
import useVentaStore from "../../store/ventaStore/ventaStore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Fade, Slide } from "react-awesome-reveal";
import pdf from "../../assets/pdf.png";
import excel from "../../assets/excel.png";

function HistorialVentasPage() {
  const { ventaProducts, fetchVentaDetails } = useVentaStore();
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Ventas", 10, 10);

    const tableColumn = ["Fecha", "Nombre", "Cantidad", "Total"];
    const tableRows = ventaProducts.map((ventaProduct) => [
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

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      ventaProducts.map((venta) => ({
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
          <div className="mt-5">
            <button onClick={exportToPDF} className="cursor-pointer">
              <img
                src={pdf}
                alt="Pdf"
                className="w-12 h-12 py-1 px-1 rounded-md"
              />
            </button>
            <button onClick={exportToExcel} className="cursor-pointer">
              <img
                src={excel}
                alt="Excel"
                className="w-12 h-12 py-1 px-1 rounded-md"
              />
            </button>
          </div>
          {ventaProducts && (
            <div className="mt-4 max-h-[380px] overflow-y-auto">
              {ventasOrdenadas.length > 0 ? (
                ventasOrdenadas.map(([mesAno, ventas]) => (
                  <div key={mesAno}>
                    <h2 className="text-lg font-bold bg-blue-600 text-white p-2 rounded-md">
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
