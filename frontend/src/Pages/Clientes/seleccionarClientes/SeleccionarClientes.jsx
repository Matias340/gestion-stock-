import { ArrowLeft, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useClienteStore from "../../../store/clientesStore/clientesStore";
import useProductStore from "../../../store/productStore/productStore";

const SeleccionarClientes = () => {
  const { clientes, setCurrentClientes, fetchCliente } = useClienteStore();
  console.log("30", clientes);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  console.log("1", clientes);

  const itemsPerPage = 5;

  useEffect(() => {
    if (clientes.length === 0) {
      fetchCliente();
    }
  }, []);

  const handleSelect = (cliente) => {
    setCurrentClientes(cliente);
    useProductStore.getState().setSelectedClient(cliente);
    navigate("/vender");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredClientes = clientes.filter((cliente) => {
    const nombre = cliente.nombre?.toLowerCase() || "";
    const email = cliente.email?.toLowerCase() || "";
    const notaCredito = cliente.notaCredito?.toString() || "";

    return (
      nombre.includes(filterText.toLowerCase()) ||
      email.includes(filterText.toLowerCase()) ||
      notaCredito.includes(filterText)
    );
  });

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = filteredClientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  console.log("2", paginatedClientes);

  return (
    <div className="p-4 max-h-[480px] overflow-y-auto">
      <div className="flex items-center gap-4">
        <Link to="/vender">
          <ArrowLeft size={30} className="sm:mr-6" />
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Seleccioná un cliente</h1>

      {/* Filtro */}
      <div className="relative w-full mb-6">
        <input
          type="text"
          placeholder="Filtrar por Nombre o Email"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm sm:text-base"
        />
        <Filter size={18} className="absolute left-3 top-2.5 text-gray-900" />
      </div>

      {/* Tabla visible solo en pantallas medianas hacia arriba */}
      <div className="hidden sm:block overflow-auto rounded-md shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-500 text-left">
            <tr>
              <th className="p-3 border-b text-white whitespace-nowrap">Nombre</th>
              <th className="p-3 border-b text-white whitespace-nowrap">Email</th>
              <th className="p-3 border-b text-white whitespace-nowrap">Credito</th>
              <th className="p-3 border-b text-white text-center whitespace-nowrap">Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClientes.length > 0 ? (
              paginatedClientes.map((cliente) => (
                <tr key={cliente._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-bold whitespace-nowrap">{cliente.nombre}</td>
                  <td className="p-3 border-b border-gray-200 font-bold whitespace-nowrap">{cliente.email}</td>
                  <td className="p-3 border-b border-gray-200 font-bold whitespace-nowrap">
                    ARS$ {new Intl.NumberFormat("es-AR").format(cliente.notaCredito)}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleSelect(cliente)}
                      className="bg-blue-600 cursor-pointer font-bold text-white px-3 py-1 rounded hover:bg-blue-500"
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No hay clientes disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards visibles solo en pantallas pequeñas */}
      <div className="block max-h-[400px] overflow-y-auto sm:hidden">
        {paginatedClientes.length > 0 ? (
          <div className="grid gap-4 grid-cols-1">
            {paginatedClientes.map((cliente) => (
              <div key={cliente._id} className="border rounded-lg shadow p-4 bg-white flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{cliente.nombre}</h2>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-bold">Email:</span> {cliente.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Credito:</span> ${cliente.notaCredito.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(cliente)}
                  className="mt-4 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">No hay clientes disponibles.</div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === page
                  ? "bg-blue-600 cursor-pointer text-white"
                  : "bg-gray-200 cursor-pointer text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeleccionarClientes;
