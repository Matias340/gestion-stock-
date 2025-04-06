import { useState, useEffect } from "react";
import useProveedorStore from "../../../store/proveedorStore/proveedorStore";
import { Filter, Plus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal"; // Importamos los efectos

function ProveedoresPage() {
  const {
    proveedores,
    fetchProveedor,
    removeProveedor,
    setCurrentProveedores,
  } = useProveedorStore();
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

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex">
              <Link to="/">
                <ArrowLeft size={35} className="mr-10" />
              </Link>
              <h1 className="text-2xl font-semibold">Proveedores</h1>
            </div>
            <Link to="/nuevoProveedor">
              <button className="flex font-bold items-center gap-2 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                <Plus size={20} /> Nuevo Proveedor
              </button>
            </Link>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Filtrar proveedor por Nombre, Direccion o Estado"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <Filter
              size={20}
              className="absolute left-3 top-2.5 text-gray-900"
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto w-full px-4">
            {filteredProveedor.length > 0 ? (
              filteredProveedor.map((proveedor) => (
                <div
                  key={proveedor._id}
                  className="bg-blue-600 p-4 mt-5 rounded-lg shadow-md w-full grid grid-cols-3 items-center gap-4"
                >
                  <div className="col-span-1">
                    <h2 className="text-lg text-white font-bold">
                      {proveedor.name}
                    </h2>
                    <p className="text-white font-bold">
                      Dirección: {proveedor.adress}
                    </p>
                    <p className="text-white font-bold">
                      Contacto: {proveedor.contact}
                    </p>
                  </div>
                  <div className="col-span-1 text-center text-white">
                    <span className="font-bold">Estado: {proveedor.state}</span>
                  </div>
                  <div className="col-span-1 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 text-sm font-bold border border-white rounded bg-white text-blue-600 cursor-pointer"
                      onClick={() => {
                        setCurrentProveedores(proveedor);
                        navigate(`/nuevoProveedor/${proveedor._id}`);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-bold border border-red-500 rounded bg-red-500 text-white cursor-pointer"
                      onClick={() => handleDeleteClick(proveedor)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No se encontraron proveedores.
              </p>
            )}
          </div>
          {/* Modal de confirmación */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">
                  ¿Seguro que quieres eliminar este proveedor?
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

export default ProveedoresPage;
