import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import pdf from "../../../assets/pdf.png";
import excel from "../../../assets/excel.png";
import useGastoStore from "../../../store/gastoStore/GastoStore";

function ExportarTabla() {
  const { gastos } = useGastoStore();
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Gastos", 10, 10);

    const tableColumn = ["Fecha", "Descripción", "Monto", "Total"];

    const totalGastosCalculado = gastos.reduce(
      (acc, gasto) => acc + gasto.monto,
      0
    );

    const tableRows = gastos.map((gasto) => [
      new Date(gasto.createdAt).toLocaleString("es-AR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      gasto.description,
      `$${gasto.monto.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      "",
    ]);

    tableRows.push([
      "Total",
      "",
      "",
      `$${totalGastosCalculado.toLocaleString("es-AR", {
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
          "Total Gastos:",
          `$${totalGastosCalculado.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        ],
      ],
    });

    doc.save("Gastos.pdf");
  };

  const exportToExcel = () => {
    const totalGastosCalculado = gastos.reduce(
      (acc, gasto) => acc + gasto.monto,
      0
    );

    const worksheetData = gastos.map((gasto) => ({
      Fecha: new Date(gasto.createdAt).toLocaleString("es-AR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      Descripcion: gasto.description,
      Monto: gasto.monto,
    }));

    // Agregar la fila de total
    worksheetData.push({
      Fecha: "Total",
      Descripcion: "",
      Monto: totalGastosCalculado,
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Gastos.xlsx");
  };

  return (
    <div>
      {/* Botones de exportación */}
      <button onClick={exportToPDF} className="cursor-pointer">
        <img src={pdf} alt="Pdf" className="w-12 h-12 py-1 px-1 rounded-md" />
      </button>
      <button onClick={exportToExcel} className="cursor-pointer">
        <img
          src={excel}
          alt="Excel"
          className="w-12 h-12 py-1 px-1 rounded-md"
        />
      </button>
    </div>
  );
}

export default ExportarTabla;
