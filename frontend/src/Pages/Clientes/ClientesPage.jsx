import { ArrowLeft, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link, useNavigate } from "react-router-dom";
import useClienteStore from "../../store/clientesStore/clientesStore";

const ITEMS_PER_PAGE = 5;

function ClientesPage() {
  const { clientes, fetchCliente, removeCliente, setCurrentClientes } = useClienteStore();
  console.log("40", clientes);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCliente();
  }, []);

  const handleDeleteClick = (cliente) => {
    setClienteToDelete(cliente);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (clienteToDelete) {
      removeCliente(clienteToDelete._id);
      setShowModal(false);
      setClienteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setClienteToDelete(null);
  };

  const filteredCliente = clientes.filter((cliente) => {
    const texto = filterText.toLowerCase();
    const nombre = cliente.nombre ? cliente.nombre.toLowerCase() : "";
    const telefono = cliente.telefono ? cliente.telefono.toString() : "";
    const email = cliente.email ? cliente.email.toLowerCase() : "";

    return nombre.includes(texto) || telefono.includes(filterText) || email.includes(texto);
  });

  const totalPages = Math.ceil(filteredCliente.length / ITEMS_PER_PAGE);
  const paginatedCliente = filteredCliente.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  console.log("20", paginatedCliente);

  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/home">
              <ArrowLeft size={30} className="sm:mr-6" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold">Clientes</h1>
          </div>
          <Link to="/nuevoCliente">
            <button className="flex cursor-pointer items-center justify-center font-bold gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base">
              <Plus size={18} /> Nuevo Cliente
            </button>
          </Link>
        </div>

        {/* Filtro */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Filtrar por Nombre, Telefono o Email"
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm sm:text-base"
          />
          <Filter size={18} className="absolute left-3 top-2.5 text-gray-900" />
        </div>

        {/* Tabla para pantallas sm y mayores */}
        <div className="hidden sm:block max-h-[400px] max-w-[340px] sm:max-w-full overflow-y-auto overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Telefono</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Credito</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCliente.length > 0 ? (
                paginatedCliente.map((cliente) => (
                  <tr key={cliente._id} className="border border-gray-200 hover:bg-blue-50">
                    <td className="py-2 px-4">{cliente.nombre}</td>
                    <td className="py-2 px-4">{cliente.telefono}</td>
                    <td className="py-2 px-4">{cliente.email}</td>
                    <td className="py-2 px-4">ARS$ {new Intl.NumberFormat("es-AR").format(cliente.notaCredito)}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="bg-blue-500 cursor-pointer text-white text-md px-3 py-1 font-bold rounded hover:bg-blue-600"
                        onClick={() => {
                          setCurrentClientes(cliente);
                          navigate(`/nuevoCliente/${cliente._id}`);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 cursor-pointer text-white text-md px-3 py-1 font-bold rounded hover:bg-red-600"
                        onClick={() => handleDeleteClick(cliente)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tarjetas para móviles */}
        <div className="sm:hidden max-h-[400px] overflow-y-auto flex flex-col gap-4 pr-2">
          {paginatedCliente.length > 0 ? (
            paginatedCliente.map((cliente) => (
              <div key={cliente._id} className="bg-white p-4 rounded shadow border border-gray-200 text-sm">
                <p>
                  <span className="font-semibold">Nombre:</span> {cliente.nombre}
                </p>
                <p>
                  <span className="font-semibold">Telefono:</span>
                  {cliente.telefono}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {cliente.email}
                </p>
                <p>
                  <span className="font-semibold">Credito:</span> {cliente.notaCredito}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-blue-500 text-white text-md px-3 py-1 font-bold rounded hover:bg-blue-600"
                    onClick={() => {
                      setCurrentClientes(cliente);
                      navigate(`/nuevoCliente/${cliente._id}`);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white text-md px-3 py-1 font-bold rounded hover:bg-red-600"
                    onClick={() => handleDeleteClick(cliente)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No se encontraron clientes.</div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-600 font-bold text-white cursor-pointer rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className=" text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-blue-500 font-bold cursor-pointer text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Modal de confirmación */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">¿Seguro que quieres eliminar este cliente?</h3>
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 cursor-pointer text-sm font-bold text-white bg-blue-600 rounded"
                  onClick={confirmDelete}
                >
                  Aceptar
                </button>
                <button
                  className="px-4 py-2 cursor-pointer text-sm font-bold text-white bg-red-500 rounded"
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

export default ClientesPage;
