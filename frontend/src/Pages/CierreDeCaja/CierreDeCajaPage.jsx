import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import useCierreStore from "../../store/cierreCaja/CierreCajaStore";

function CierreDeCajaPage() {
  const { cierres, fetchCierres, crearCierre, eliminarCierre, loading, error } = useCierreStore();
  const [nuevoCierre, setNuevoCierre] = useState({
    efectivoInicial: "",
    efectivoFinal: "",
    ingresosAdicionales: "",
    gastos: "",
    notas: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [cierreAEliminar, setCierreAEliminar] = useState(null);
  useEffect(() => {
    fetchCierres();
  }, [fetchCierres]);

  const handleChange = (e) => {
    setNuevoCierre({
      ...nuevoCierre,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir los valores a números donde corresponda
    const cierreData = {
      ...nuevoCierre,
      efectivoInicial: parseFloat(nuevoCierre.efectivoInicial),
      efectivoFinal: parseFloat(nuevoCierre.efectivoFinal),
      ingresosAdicionales: parseFloat(nuevoCierre.ingresosAdicionales),
      gastos: parseFloat(nuevoCierre.gastos),
    };

    crearCierre(cierreData);
    setNuevoCierre({
      efectivoInicial: "",
      efectivoFinal: "",
      ingresosAdicionales: "",
      gastos: "",
      notas: "",
    });
  };

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const indexInicial = (paginaActual - 1) * elementosPorPagina;
  const indexFinal = indexInicial + elementosPorPagina;
  const cierresPaginados = cierres.slice(indexInicial, indexFinal);

  const totalPaginas = Math.ceil(cierres.length / elementosPorPagina);

  const confirmDelete = () => {
    if (cierreAEliminar) {
      eliminarCierre(cierreAEliminar);
      setShowModal(false);
      setCierreAEliminar(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setCierreAEliminar(null);
  };

  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="p-4 max-h-[480px] overflow-y-auto">
        <Link to="/home">
          <ArrowLeft size={35} className="mr-10 mb-10" />
        </Link>
        <h1 className="text-2xl font-bold mb-4">Cierres de Caja</h1>

        {loading && <p>Cargando datos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="efectivoInicial"
            placeholder="Efectivo inicial"
            value={nuevoCierre.efectivoInicial}
            onWheel={(e) => e.target.blur()} // Evita scroll
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value) || value === "") {
                handleChange(e); // Asegurate que handleChange guarde string temporal
              }
            }}
            className="border p-2 w-full outline-none rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />

          <input
            type="text"
            name="efectivoFinal"
            placeholder="Efectivo final"
            value={nuevoCierre.efectivoFinal}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value) || value === "") {
                handleChange(e);
              }
            }}
            className="border p-2 w-full rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="text"
            name="ingresosAdicionales"
            placeholder="Ingresos adicionales"
            value={nuevoCierre.ingresosAdicionales}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value) || value === "") {
                handleChange(e);
              }
            }}
            className="border p-2 w-full rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="text"
            name="gastos"
            placeholder="Gastos"
            value={nuevoCierre.gastos}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value) || value === "") {
                handleChange(e);
              }
            }}
            className="border p-2 w-full rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <textarea
            name="notas"
            placeholder="Notas"
            value={nuevoCierre.notas}
            onChange={handleChange}
            className="border p-2 w-full rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 font-bold cursor-pointer text-white px-4 py-2 rounded"
          >
            Crear Cierre de Caja
          </button>
        </form>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold">Lista de Cierres</h2>
        {/* Tabla solo en pantallas medianas y grandes */}
        <div className="hidden sm:block max-h-[400px] max-w-[340px] sm:max-w-full overflow-y-auto overflow-x-auto">
          <table className="w-full bg-white rounded shadow ">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="text-sm p-2">Fecha</th>
                <th className="text-sm p-2">Total Ventas</th>
                <th className="text-sm p-2">Efectivo Final</th>
                <th className="text-sm p-2">Notas</th>
                <th className="text-sm p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cierresPaginados.map((cierre) => (
                <tr key={cierre._id} className="bg-white border border-gray-200 text-gray-900 text-center">
                  <td className="text-sm p-2">{new Date(cierre.fecha).toLocaleString()}</td>
                  <td className="text-sm p-2">${cierre.ventasTotales}</td>
                  <td className="text-sm p-2">${cierre.efectivoFinal}</td>
                  <td className="text-sm p-2">{cierre.notas}</td>
                  <td className="text-sm p-2">
                    <button
                      onClick={() => {
                        setCierreAEliminar(cierre._id);
                        setShowModal(true);
                      }}
                      className="bg-red-500 font-bold cursor-pointer hover:bg-red-600 text-white px-2 py-1 rounded text-md"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tarjetas para móviles */}
        <div className="sm:hidden flex flex-col gap-4">
          {cierresPaginados.map((cierre) => (
            <div key={cierre._id} className="bg-white p-4 rounded shadow border border-gray-200">
              <p>
                <span className="text-sm font-semibold">Fecha:</span> {new Date(cierre.fecha).toLocaleString()}
              </p>
              <p>
                <span className="text-sm font-semibold">Total Ventas:</span> ${cierre.ventasTotales}
              </p>
              <p>
                <span className="text-sm font-semibold">Efectivo Final:</span> ${cierre.efectivoFinal}
              </p>
              <p>
                <span className="text-sm font-semibold">Notas:</span> {cierre.notas}
              </p>
              <button
                onClick={() => {
                  setCierreAEliminar(cierre._id);
                  setShowModal(true);
                }}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-md"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1 bg-blue-600 font-bold text-white cursor-pointer rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className=" text-sm">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 bg-blue-600 font-bold cursor-pointer text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Modal de confirmación */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">¿Seguro que quieres eliminar este Cierre de Caja?</h3>
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 cursor-pointer text-sm font-bold text-white bg-blue-600 rounded"
                  onClick={confirmDelete}
                >
                  Aceptar
                </button>
                <button
                  className="px-4 py-2 text-sm cursor-pointer font-bold text-white bg-red-500 rounded"
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
  );
}

export default CierreDeCajaPage;
