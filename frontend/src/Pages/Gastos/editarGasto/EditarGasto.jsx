import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useGastoStore from "../../../store/gastoStore/GastoStore";

function EditarGasto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentGasto, actualizarGasto, clearCurrentGasto } = useGastoStore();

  const [monto, setMonto] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id && currentGasto) {
      setMonto(currentGasto.monto || "");
      setDescription(currentGasto.description || "");
    }
  }, [id, currentGasto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await actualizarGasto(id, { monto, description });
      toast.success("Gasto actualizado correctamente");
      navigate("/gastos");
    } catch (error) {
      console.error("Error al actualizar:", error);
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
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="h-[calc(100vh-100px)] flex items-center justify-center mt-4 mb-10">
          <div className="max-h-[500px] overflow-y-auto px-4 bg-white p-6 rounded-lg border border-gray-200 shadow-xl w-[800px]">
            <Link to="/gastos">
              <ArrowLeft size={35} className="mr-10" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Editar Gasto</h1>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
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
              <div className="col-span-2 flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Descripción:</label>
                <textarea
                  type="text"
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-900 border-2 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold cursor-pointer py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Fade>
    </>
  );
}

export default EditarGasto;
