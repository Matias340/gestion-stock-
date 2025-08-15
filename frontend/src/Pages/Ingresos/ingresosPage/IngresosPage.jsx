import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import excel from "../../../assets/excel.png";
import pdf from "../../../assets/pdf.png";
import useVentaStore from "../../../store/ventaStore/ventaStore";

function IngresosPage() {
  const { ventaProducts, fetchVentaDetails, markSaleAsPaid } = useVentaStore();
  const [filtro, setFiltro] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10;

  const indexUltimaVenta = paginaActual * ventasPorPagina;
  const indexPrimeraVenta = indexUltimaVenta - ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indexPrimeraVenta, indexUltimaVenta);

  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  useEffect(() => {
    fetchVentaDetails();
  }, []);

  useEffect(() => {
    if (!ventaProducts) return;

    const hoy = new Date(); // <<<< Declaración global dentro del useEffect
    let ventasFiltradas = ventaProducts;

    if (filtro === "today") {
      ventasFiltradas = ventaProducts.filter((venta) => {
        const fechaVenta = new Date(venta.createdAt);
        return (
          fechaVenta.getDate() === hoy.getDate() &&
          fechaVenta.getMonth() === hoy.getMonth() &&
          fechaVenta.getFullYear() === hoy.getFullYear()
        );
      });
    } else if (filtro === "week") {
      const haceUnaSemana = new Date();
      haceUnaSemana.setDate(hoy.getDate() - 7);

      ventasFiltradas = ventaProducts.filter((venta) => {
        const fechaVenta = new Date(venta.createdAt);
        return fechaVenta >= haceUnaSemana && fechaVenta <= hoy;
      });
    } else if (filtro === "month") {
      const haceUnMes = new Date();
      haceUnMes.setMonth(hoy.getMonth() - 1);

      ventasFiltradas = ventaProducts.filter((venta) => {
        const fechaVenta = new Date(venta.createdAt);
        return fechaVenta >= haceUnMes && fechaVenta <= hoy;
      });
    }

    setVentasFiltradas(ventasFiltradas);
  }, [filtro, ventaProducts]);

  useEffect(() => {
    if (ventasFiltradas.length > 0) {
      let total = ventasFiltradas.reduce((sum, venta) => sum + (Number(venta.total) || 0), 0);
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

  console.log(ventasPaginadas);

  const handleEstadoChange = (ventaId, nuevoEstado) => {
    if (nuevoEstado === "cobrado") {
      markSaleAsPaid(ventaId);
    }
    // Si querés manejar otros estados en el futuro, podés agregarlos acá
  };

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="max-h-[490px] max-w-[344px] sm:max-w-full md:max-w-3xl lg:max-w-5xl mx-auto overflow-x-auto overflow-y-auto  p-4  w-full">
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
              <option value="month">Último mes</option>
            </select>

            <button onClick={exportToPDF} className="cursor-pointer">
              <img src={pdf} alt="Pdf" className="w-12 h-12 py-1 px-1 rounded-md" />
            </button>
            <button onClick={exportToExcel} className="cursor-pointer">
              <img src={excel} alt="Excel" className="w-12 h-12 py-1 px-1 rounded-md" />
            </button>
          </div>

          {/* Tabla de ventas */}
          <div className="relative overflow-x-auto">
            {/* Vista tipo tabla en escritorio */}
            <div className="hidden sm:block max-h-[320px] overflow-y-auto overflow-x-auto mt-4 mb-20">
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
                      Estado
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Total
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ventasPaginadas.map((venta) => (
                    <tr key={venta.id} className="bg-white border-b border-gray-200">
                      <td className="px-4 py-2">{new Date(venta.createdAt).toLocaleString("es-AR")}</td>
                      <td className="px-4 py-2">{venta.products.map((p) => p.name).join(", ")}</td>
                      <td className="px-4 py-2">{venta.medioPago}</td>
                      <select
                        value={venta.estado}
                        onChange={(e) => handleEstadoChange(venta._id, e.target.value)}
                        className="border rounded px-2 py-1 mt-2 mb-2"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="cobrado">Cobrado</option>
                      </select>
                      <td className="px-4 py-2 font-bold text-gray-900">${venta.total}</td>
                      <td className="px-4 py-2">
                        {venta.pagoDetalle
                          ? Object.entries(venta.pagoDetalle)
                              .filter(([metodo, monto]) => monto > 0) // solo métodos con monto
                              .map(([metodo, monto]) => `${metodo}: $${monto}`) // formateamos cada uno
                              .join(" | ") // unimos con separador
                          : `${venta.medioPago}: $${venta.total}`}{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista tipo tarjetas en móviles */}
            <div className="sm:hidden mt-4 max-h-[320px] overflow-y-auto flex flex-col gap-4 mb-20 pr-2">
              {ventasPaginadas.map((venta) => (
                <div key={venta.id} className="bg-white border border-gray-300 rounded shadow p-4 text-sm">
                  <p>
                    <span className="font-semibold">Fecha:</span>
                    <br />
                    {new Date(venta.createdAt).toLocaleString("es-AR")}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Nombre:</span>
                    <br />
                    {venta.products.map((p) => p.name).join(", ")}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Método de Pago:</span>
                    <br />
                    {venta.medioPago}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Estado:</span>
                    <br />
                    <select
                      value={venta.estado}
                      onChange={(e) => handleEstadoChange(venta._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="cobrado">Cobrado</option>
                    </select>
                  </p>
                  <p className="mt-2 font-semibold text-green-700">Total: ${venta.total}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="px-3 py-1 cursor-pointer bg-blue-600 font-bold text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 cursor-pointer bg-blue-600 font-bold text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
}

export default IngresosPage;
