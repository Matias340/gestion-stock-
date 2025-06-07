import { ArrowLeft, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal"; // Importamos los efectos
import { Link, useNavigate } from "react-router-dom";
import useProveedorStore from "../../../store/proveedorStore/proveedorStore";

function ProveedoresPage() {
  const { proveedores, fetchProveedor, removeProveedor, setCurrentProveedores } = useProveedorStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchProveedor();
  }, []);

  const handleDeleteClick = (proveedor) => {
    setProveedorToDelete(proveedor);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (proveedorToDelete) {
      removeProveedor(proveedorToDelete._id);
      setShowModal(false);
      setProveedorToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProveedorToDelete(null);
  };

  const filteredProveedor = proveedores.filter((proveedor) => {
    return (
      proveedor.name.toLowerCase().includes(filterText.toLowerCase()) ||
      proveedor.identify.toString().includes(filterText) ||
      proveedor.state.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProveedor.length / itemsPerPage);
  const currentPageData = filteredProveedor.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          {/* Título y botón */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div className="flex items-center gap-4">
              <Link to="/home">
                <ArrowLeft size={35} className="mr-10" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-semibold">Proveedores</h1>
            </div>
            <Link to="/nuevoProveedor">
              <button className="flex items-center cursor-pointer justify-center font-bold gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base">
                <Plus size={20} /> Nuevo Proveedor
              </button>
            </Link>
          </div>

          {/* Filtro */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Filtrar proveedor por Nombre, Direccion o Estado"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm sm:text-base"
            />
            <Filter size={18} className="absolute left-3 top-2.5 text-gray-900" />
          </div>

          {/* Tabla con scroll en pantallas pequeñas */}
          {/* Vista de tabla para escritorio */}
          <div className="hidden sm:block max-h-[400px] overflow-y-auto overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Dirección</th>
                  <th className="px-4 py-2 text-left">Contacto</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.length > 0 ? (
                  currentPageData.map((proveedor) => (
                    <tr key={proveedor._id} className="border border-gray-300">
                      <td className="px-4 py-2 font-medium">{proveedor.name}</td>
                      <td className="px-4 py-2">{proveedor.adress}</td>
                      <td className="px-4 py-2">{proveedor.contact}</td>
                      <td className="px-4 py-2">{proveedor.state}</td>
                      <td className="px-4 py-2 flex flex-col sm:flex-row gap-2">
                        <button
                          className="px-3 py-1 cursor-pointer text-sm font-bold bg-blue-600 rounded text-white"
                          onClick={() => {
                            setCurrentProveedores(proveedor);
                            navigate(`/nuevoProveedor/${proveedor._id}`);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1 text-sm cursor-pointer font-bold border border-red-600 rounded text-white bg-red-600"
                          onClick={() => handleDeleteClick(proveedor)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      No se encontraron proveedores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas para móviles */}
          <div className="sm:hidden max-h-[400px] overflow-y-auto flex flex-col gap-4 pr-2">
            {currentPageData.length > 0 ? (
              currentPageData.map((proveedor) => (
                <div key={proveedor._id} className="bg-white p-4 rounded shadow border border-gray-300 text-sm">
                  <p>
                    <span className="font-semibold">Nombre:</span> {proveedor.name}
                  </p>
                  <p>
                    <span className="font-semibold">Dirección:</span> {proveedor.adress}
                  </p>
                  <p>
                    <span className="font-semibold">Contacto:</span> {proveedor.contact}
                  </p>
                  <p>
                    <span className="font-semibold">Estado:</span> {proveedor.state}
                  </p>
                  <div className="flex gap-2 mt-2 flex-col xs:flex-row">
                    <button
                      className="px-3 py-1 cursor-pointer text-sm font-bold bg-blue-600 rounded text-white"
                      onClick={() => {
                        setCurrentProveedores(proveedor);
                        navigate(`/nuevoProveedor/${proveedor._id}`);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-1 text-sm cursor-pointer font-bold border border-red-600 rounded text-white bg-red-600"
                      onClick={() => handleDeleteClick(proveedor)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No se encontraron proveedores.</div>
            )}
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Modal de confirmación */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">¿Seguro que quieres eliminar este proveedor?</h3>
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

export default ProveedoresPage;
