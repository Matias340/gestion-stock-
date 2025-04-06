import React, { useState, useEffect } from "react";
import useProveedorStore from "../../../store/proveedorStore/proveedorStore";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Fade, Slide } from "react-awesome-reveal";

function NuevoProveedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProveedores,
    addProveedor,
    updateProveedor,
    clearCurrentProveedores,
  } = useProveedorStore();

  const [name, setName] = useState("");
  const [identify, setIdentify] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id && currentProveedores) {
      setName(currentProveedores.name || "");
      setDescription(currentProveedores.description || "");
      setIdentify(currentProveedores.identify || "");
      setContact(currentProveedores.contact || "");
      setPhone(currentProveedores.phone || "");
      setAdress(currentProveedores.adress || "");
      setState(currentProveedores.state || "");
    }
  }, [id, currentProveedores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const proveedorData = {
      name,
      description,
      identify,
      contact,
      phone,
      adress,
      state,
    };

    try {
      if (id) {
        await updateProveedor(id, proveedorData);
        toast.success("Proveedor actualizado correctamente");
      } else {
        await addProveedor(proveedorData);
        toast.success("Proveedor agregado correctamente");
      }

      // Limpiar formulario
      setName("");
      setDescription("");
      setIdentify("");
      setContact("");
      setPhone("");
      setAdress("");
      setState("");
      clearCurrentProveedores();

      navigate("/proveedores");
    } catch (error) {
      toast.error("Ocurrió un error al guardar el proveedor");
      console.error("Error al guardar proveedor:", error);
    }
  };

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="h-[calc(100vh-100px)] flex items-center justify-center mt-4 mb-10">
          <div className="max-h-[500px] overflow-y-auto px-4 bg-white p-6 rounded-lg shadow-xl w-[800px]">
            <Link to="/proveedores">
              <ArrowLeft size={35} className="mr-10" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {id ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h1>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Nombre:
                </label>
                <input
                  type="text"
                  placeholder="Nombre del proveedor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Identificación:
                </label>
                <input
                  type="text"
                  value={identify}
                  placeholder="Identificación"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) =>
                    setIdentify(e.target.value.replace(/\D/, ""))
                  }
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Email:
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Telefono:
                </label>
                <input
                  type="text"
                  placeholder="Telefono"
                  value={phone}
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Estado:
                </label>
                <select
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Seleccionar estado
                  </option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Dirección:
                </label>
                <input
                  type="text"
                  placeholder="Dirección"
                  value={adress}
                  required
                  onChange={(e) => setAdress(e.target.value)}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="col-span-2 flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Descripción:
                </label>
                <textarea
                  type="text"
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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

export default NuevoProveedor;
