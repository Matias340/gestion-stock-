import { useState, useEffect } from "react";
import useVentaStore from "../../../store/ventaStore/ventaStore";
import useGastoStore from "../../../store/gastoStore/GastoStore";
import { ArrowLeft } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { Link, useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

function GastosPage() {
  const { ventaProducts, fetchVentaDetails } = useVentaStore();
  const [ingresos, setIngresos] = useState([{ amount: "" }]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [gananciaTotal, setGananciaTotal] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const { id } = useParams();
  const {
    currentGasto,
    addGasto,
    gastos,
    removeGasto,
    setCurrentGasto,
    clearCurrentGasto,
    fetchGasto,
  } = useGastoStore();

  const [monto, setMonto] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);
  const [gastosToDelete, setGastosToDelete] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVentaDetails();
    fetchGasto();
  }, []);

  useEffect(() => {
    if (id && currentGasto) {
      setMonto(currentGasto.monto || "");
      setDescription(currentGasto.description || "");
    }
  }, [id, currentGasto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gastoData = { monto, description };

    try {
      await addGasto(gastoData);
      toast.success("Gasto agregado correctamente");

      setMonto("");
      setDescription("");
      clearCurrentGasto();
    } catch (error) {
      toast.error("Ocurrió un error al guardar el gasto");
      console.error("Error al guardar gasto:", error);
    }
  };

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

  const handleMontoChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9]/g, "");

    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    setMonto(value);
  };

  const handleDeleteClick = (gasto) => {
    setGastoToDelete(gasto);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (gastoToDelete) {
      // Eliminación individual
      removeGasto(gastoToDelete._id);
    } else if (gastosToDelete.length > 0) {
      // Eliminación masiva
      gastosToDelete.forEach((gasto) => removeGasto(gasto._id));
      setGastosToDelete([]);
    }

    setShowModal(false);
    setGastoToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setGastoToDelete(null);
  };

  useEffect(() => {
    setGananciaTotal(totalIngresos - totalGastos);
  }, [totalIngresos, totalGastos]);

  const handleDeleteByDate = (range) => {
    const now = new Date();
    let filteredGastos = [];

    if (range === "day") {
      filteredGastos = gastos.filter((gasto) => {
        const gastoDate = new Date(gasto.createdAt);
        return (
          gastoDate.getDate() === now.getDate() &&
          gastoDate.getMonth() === now.getMonth() &&
          gastoDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (range === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      filteredGastos = gastos.filter(
        (gasto) => new Date(gasto.createdAt) >= lastWeek
      );
    } else if (range === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      filteredGastos = gastos.filter(
        (gasto) => new Date(gasto.createdAt) >= lastMonth
      );
    }

    if (filteredGastos.length > 0) {
      setGastosToDelete(filteredGastos); // Guardar gastos a eliminar
      setShowModal(true);
    } else {
      alert("No hay gastos en este período.");
    }
  };

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Gastos", 10, 10);

    const tableColumn = ["Fecha", "Descripción", "Monto"];
    console.log(gastos);
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
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Gastos.pdf");
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      gastos.map((gasto) => ({
        Fecha: new Date(gasto.createdAt).toLocaleString("es-AR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        Descripción: gasto.description.map((p) => p.name).join(", "),
        Monto: gasto.monto,
      }))
    );

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
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="max-h-[510px] overflow-y-auto bg-white p-4 shadow-md rounded-md w-full">
          <div className="flex mb-4">
            <Link to="/">
              <ArrowLeft size={35} className="mr-10" />
            </Link>
            <h1 className="text-2xl font-semibold">Gastos</h1>
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
          <form
            onSubmit={handleSubmit}
            className="mt-8 shadow-md rounded-md border border-gray-100"
          >
            <h1 className="font-bold text-xl mb-2 ml-4 mt-2">Agregar Gasto</h1>
            <div className="flex flex-col mt-5 mb-2 ml-4">
              <label className="mb-2 font-bold">Descripción:</label>
              <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                required
                className="pl-2 py-1 mr-4 border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
            </div>

            {ingresos.length > 0 ? (
              ingresos.map((method, index) => (
                <div key={index} className="flex flex-col mt-2 mb-2 ml-4">
                  <label className="mb-2 font-bold">Monto:</label>
                  <input
                    type="text"
                    placeholder="$ Monto"
                    value={
                      monto.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || ""
                    }
                    onChange={handleMontoChange}
                    className="pl-2 py-1 w-48 border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              ))
            ) : (
              <p className="ml-4 text-gray-500">No hay monto</p>
            )}
            <div className="flex flex-col mt-5">
              <button className="w-48 ml-4 mb-4 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded text-white py-2 font-bold">
                Agregar Gasto
              </button>
            </div>
          </form>

          <div className="relative overflow-x-auto mt-5">
            <h1 className="font-bold mt-2 mb-2">Historial de Gastos</h1>
            <div className="flex gap-2 mb-4">
              <button
                className="px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
                onClick={() => handleDeleteByDate("day")}
              >
                Eliminar Gastos de Hoy
              </button>
              <button
                className="px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
                onClick={() => handleDeleteByDate("week")}
              >
                Eliminar Gastos de la Última Semana
              </button>
              <button
                className="px-4 py-1 bg-red-600 cursor-pointer text-white font-bold rounded hover:bg-red-700"
                onClick={() => handleDeleteByDate("month")}
              >
                Eliminar Gastos del Último Mes
              </button>
            </div>
            {/* Botones de exportación */}
            <button
              onClick={exportToPDF}
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-bold py-1 px-2 mr-2 mb-2 rounded"
            >
              Exportar PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-1 px-2 mb-2 rounded"
            >
              Exportar Excel
            </button>

            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-blue-500">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Descripción
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Monto
                  </th>
                  <th scope="col" className="px-4 py-2 text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto) => (
                  <tr
                    className="bg-white border-b border-gray-200"
                    key={gasto.id}
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {new Date(gasto.createdAt).toLocaleString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </th>
                    <td className="px-4 py-2">{gasto.description}</td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {gasto.monto}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="px-4 py-1 rounded-sm font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        onClick={() => {
                          setCurrentGasto(gasto);
                          navigate(`/editarGasto/${gasto._id}`);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="ml-2 px-4 py-1 rounded-sm font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        onClick={() => {
                          handleDeleteClick(gasto);
                          setShowModal(true);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">
                  ¿Seguro que quieres eliminar{" "}
                  {gastoToDelete ? "este gasto" : "estos gastos"}?
                </h3>
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-500 cursor-pointer rounded"
                    onClick={confirmDelete}
                  >
                    Aceptar
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-bold text-white bg-red-500 cursor-pointer rounded"
                    onClick={cancelDelete}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Fade>
    </>
  );
}

export default GastosPage;
