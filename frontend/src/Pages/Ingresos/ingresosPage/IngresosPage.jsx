import { useState, useEffect } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Fade } from "react-awesome-reveal";
import pdf from "../../../assets/pdf.png";
import excel from "../../../assets/excel.png";

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

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Ingresos", 10, 10);

    const tableColumn = ["Fecha", "Nombre", "Método de Pago", "Total"];
    const tableRows = ventasFiltradas.map((venta) => [
      new Date(venta.createdAt).toLocaleString("es-AR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      venta.products.map((p) => p.name).join(", "),
      venta.medioPago,
      `$${venta.total.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    ]);

    tableRows.push([
      "Total",
      "",
      "",
      `$${totalIngresos.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      foot: [
        [
          "",
          "",
          "Total Ingresos:",
          `$${totalIngresos.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        ],
      ],
    });

    doc.save("Ingresos.pdf");
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheetData = ventasFiltradas.map((venta) => ({
      Fecha: new Date(venta.createdAt).toLocaleString("es-AR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      Nombre: venta.products.map((p) => p.name).join(", "),
      "Método de Pago": venta.medioPago,
      Total: venta.total,
    }));

    // Agregar la fila de total
    worksheetData.push({
      Fecha: "Total",
      Nombre: "",
      "Método de Pago": "",
      Total: totalIngresos,
    });

    // Crear la hoja de cálculo con los datos
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ingresos");

    // Convertir a Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Guardar archivo
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Ingresos.xlsx");
  };

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="max-h-[510px] overflow-y-auto bg-white p-4 shadow-md rounded-md w-full">
          <div className="flex mb-4">
            <Link to="/home">
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
          <div className="mb-3 flex gap-4">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-48 border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Todas las ventas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
            </select>

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

          {/* Tabla de ventas */}
          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-white uppercase bg-blue-500">
                <tr>
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
                  <tr
                    key={venta.id}
                    className="bg-white border-b border-gray-200"
                  >
                    <td className="px-4 py-2">
                      {new Date(venta.createdAt).toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-2">
                      {venta.products.map((p) => p.name).join(", ")}
                    </td>
                    <td className="px-4 py-2">{venta.medioPago}</td>
                    <td className="px-4 py-2 font-bold text-gray-900">
                      ${venta.total}
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
