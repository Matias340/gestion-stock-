import { ArrowLeft, Filter } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProductStore from "../../../store/productStore/productStore";

const SeleccionarProducto = () => {
  const { products, setCurrentProduct } = useProductStore();
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  const handleSelect = (product) => {
    setCurrentProduct(product);
    navigate("/vender");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const barcode = product.barcode?.toLowerCase() || "";
    const price = product.price?.toString() || "";

    return (
      name.includes(filterText.toLowerCase()) ||
      barcode.includes(filterText.toLowerCase()) ||
      price.includes(filterText)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 max-h-[480px] overflow-y-auto">
      <div className="flex items-center gap-4">
        <Link to="/vender">
          <ArrowLeft size={30} className="sm:mr-6" />
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Seleccioná un producto</h1>

      {/* Filtro */}
      <div className="relative w-full mb-6">
        <input
          type="text"
          placeholder="Filtrar por Nombre, Precio o Código"
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
              <th className="p-3 border-b text-white whitespace-nowrap">Código de barras</th>
              <th className="p-3 border-b text-white whitespace-nowrap">Precio</th>
              <th className="p-3 border-b text-white text-center whitespace-nowrap">Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-bold whitespace-nowrap">{product.name}</td>
                  <td className="p-3 border-b border-gray-200 font-bold whitespace-nowrap">{product.barcode}</td>
                  <td className="p-3 border-b border-gray-200 font-bold whitespace-nowrap">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleSelect(product)}
                      className="bg-green-600 cursor-pointer font-bold text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No hay productos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards visibles solo en pantallas pequeñas */}
      <div className="block max-h-[400px] overflow-y-auto sm:hidden">
        {paginatedProducts.length > 0 ? (
          <div className="grid gap-4 grid-cols-1">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="border rounded-lg shadow p-4 bg-white flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-bold">Código:</span> {product.barcode}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Precio:</span> ${product.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(product)}
                  className="mt-4 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">No hay productos disponibles.</div>
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

export default SeleccionarProducto;
