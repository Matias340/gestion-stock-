import { useState, useEffect } from "react";
import useGastoStore from "../../../store/gastoStore/GastoStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function FormularioGasto() {
  const [ingresos, setIngresos] = useState([{ amount: "" }]);
  const { id } = useParams();
  const [monto, setMonto] = useState("");
  const [description, setDescription] = useState("");
  const { currentGasto, addGasto, clearCurrentGasto } = useGastoStore();

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

  const handleMontoChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9]/g, "");

    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    setMonto(value);
  };

  return (
    <div>
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
    </div>
  );
}

export default FormularioGasto;
