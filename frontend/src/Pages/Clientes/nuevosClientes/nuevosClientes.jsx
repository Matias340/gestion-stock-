import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useClienteStore from "../../../store/clientesStore/clientesStore";

function NuevoClientes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentClientes, fetchClienteDetails, addCliente, updateCliente, clearCurrentClientes, setCurrentClientes } =
    useClienteStore();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [notaCredito, setNotaCredito] = useState("");

  useEffect(() => {
    if (id) {
      fetchClienteDetails(id).then((cliente) => {
        if (cliente) {
          setCurrentClientes(cliente);
          setNombre(cliente.nombre || "");
          setTelefono(cliente.telefono || "");
          setEmail(cliente.email || "");
          setNotaCredito(cliente.notaCredito || "");
        } else {
          toast.error("Cliente no encontrado");
          navigate("/clientes");
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clienteData = {
      nombre,
      telefono,
      email,
      notaCredito,
    };

    try {
      if (id) {
        await updateCliente(id, clienteData);
        toast.success("Cliente actualizado correctamente");
      } else {
        await addCliente(clienteData);
        toast.success("Cliente agregado correctamente");
      }

      // Limpiar formulario
      setNombre("");
      setTelefono("");
      setEmail("");
      setNotaCredito("");
      clearCurrentClientes();

      navigate("/clientes");
    } catch (error) {
      toast.error("Ocurrió un error al guardar el cliente");
      console.error("Error al guardar cliente:", error);
    }
  };

  const handleNotaCreditoChange = (e) => {
    let value = e.target.value;

    // Permitir signo negativo opcional y números con decimales
    if (/^-?\d*\.?\d*$/.test(value)) {
      setNotaCredito(value);
    }
  };

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="h-[calc(100vh-100px)] mt-10 flex items-center justify-center mt-4 px-2">
          <div className="w-full mb-10 max-w-full sm:max-w-[600px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-xl">
            <Link to="/clientes">
              <ArrowLeft size={35} className="mr-10" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
              {id ? "Editar Cliente" : "Nuevo Cliente"}
            </h1>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Nombre:</label>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoFocus
                  required
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Campo Teléfono */}
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Teléfono:</label>
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={telefono}
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/, ""))}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Campo Email */}
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Email:</label>
                <input
                  type="text"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Credito del cliente:</label>
                <input
                  type="text"
                  placeholder="Credito del cliente"
                  required
                  value={
                    notaCredito.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || ""
                  }
                  onChange={handleNotaCreditoChange}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
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

export default NuevoClientes;
