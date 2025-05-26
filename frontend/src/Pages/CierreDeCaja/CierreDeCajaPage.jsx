import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
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

  return (
    <div className="p-4 max-h-[480px] overflow-y-auto">
      <Link to="/home">
        <ArrowLeft size={35} className="mr-10 mb-10" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">Cierres de Caja</h1>

      {loading && <p>Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          name="efectivoInicial"
          placeholder="Efectivo inicial"
          value={nuevoCierre.efectivoInicial}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
        />
        <input
          type="number"
          name="efectivoFinal"
          placeholder="Efectivo final"
          value={nuevoCierre.efectivoFinal}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
        />
        <input
          type="number"
          name="ingresosAdicionales"
          placeholder="Ingresos adicionales"
          value={nuevoCierre.ingresosAdicionales}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
        />
        <input
          type="number"
          name="gastos"
          placeholder="Gastos"
          value={nuevoCierre.gastos}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
        />
        <textarea
          name="notas"
          placeholder="Notas"
          value={nuevoCierre.notas}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
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
      <ul className="mt-4 space-y-2">
        {cierres.map((cierre) => (
          <li key={cierre._id} className="border p-2 rounded bg-blue-600 text-white font-bold relative">
            <button
              onClick={() => eliminarCierre(cierre._id)}
              className="absolute cursor-pointer top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Eliminar
            </button>
            <p>Fecha: {new Date(cierre.fecha).toLocaleString()}</p>
            <p>Total Ventas: ${cierre.ventasTotales}</p>
            <p>Efectivo Final: ${cierre.efectivoFinal}</p>
            <p>Notas: {cierre.notas}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CierreDeCajaPage;
