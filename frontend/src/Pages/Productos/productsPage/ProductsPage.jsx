import { ArrowLeft, Filter, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useProductStore from "../../../store/productStore/productStore";

const ITEMS_PER_PAGE = 5;
const STOCK_MINIMO = 5;

function ProductsPage() {
  const { products, fetchProduct, removeProduct, setCurrentProduct } = useProductStore();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const stockAlertShown = useRef(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    const productosConStockBajo = products.filter((p) => p.stockAmount <= STOCK_MINIMO);
    if (productosConStockBajo.length > 0 && !stockAlertShown.current) {
      toast.warn(`Atención: Hay ${productosConStockBajo.length} productos con stock bajo.`, {
        position: "top-right",
        autoClose: 3000,
      });
      stockAlertShown.current = true;
    }
  }, [products]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      removeProduct(productToDelete._id);
      setShowModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filterText.toLowerCase()) ||
      product.price.toString().includes(filterText) ||
      product.barcode.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/home">
              <ArrowLeft size={30} className="sm:mr-6" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold">Productos</h1>
          </div>
          <Link to="/nuevoProducto">
            <button className="flex cursor-pointer items-center justify-center font-bold gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base">
              <Plus size={18} /> Nuevo Producto
            </button>
          </Link>
        </div>

        {/* Filtro */}
        <div className="relative w-full mb-4">
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

        {/* Tabla para pantallas sm y mayores */}
        <div className="hidden sm:block max-h-[400px] max-w-[340px] sm:max-w-full overflow-y-auto overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Precio</th>
                <th className="py-2 px-4 text-left">Código</th>
                <th className="py-2 px-4 text-left">Stock</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product._id} className="border border-gray-200 hover:bg-blue-50">
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">ARS$ {new Intl.NumberFormat("es-AR").format(product.price)}</td>
                    <td className="py-2 px-4">{product.barcode}</td>
                    <td
                      className={`py-2 px-4 font-bold ${
                        product.stockAmount <= STOCK_MINIMO ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {product.stockAmount > 0 ? product.stockAmount : "Agotado"}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="bg-blue-500 cursor-pointer text-white text-md px-3 py-1 font-bold rounded hover:bg-blue-600"
                        onClick={() => {
                          setCurrentProduct(product);
                          navigate(`/nuevoProducto/${product._id}`);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 cursor-pointer text-white text-md px-3 py-1 font-bold rounded hover:bg-red-600"
                        onClick={() => handleDeleteClick(product)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tarjetas para móviles */}
        <div className="sm:hidden max-h-[400px] overflow-y-auto flex flex-col gap-4 pr-2">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded shadow border border-gray-200 text-sm">
                <p>
                  <span className="font-semibold">Nombre:</span> {product.name}
                </p>
                <p>
                  <span className="font-semibold">Precio:</span> ARS${" "}
                  {new Intl.NumberFormat("es-AR").format(product.price)}
                </p>
                <p>
                  <span className="font-semibold">Código:</span> {product.barcode}
                </p>
                <p className={`font-bold ${product.stockAmount <= STOCK_MINIMO ? "text-red-600" : "text-green-600"}`}>
                  <span className="font-normal text-black">Stock:</span>{" "}
                  {product.stockAmount > 0 ? product.stockAmount : "Agotado"}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-blue-500 text-white text-md px-3 py-1 font-bold rounded hover:bg-blue-600"
                    onClick={() => {
                      setCurrentProduct(product);
                      navigate(`/nuevoProducto/${product._id}`);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white text-md px-3 py-1 font-bold rounded hover:bg-red-600"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No se encontraron productos.</div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white cursor-pointer rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className=" text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-blue-500 cursor-pointer text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Modal de confirmación */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">¿Seguro que quieres eliminar este producto?</h3>
              <div className="flex justify-between">
                <button className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded" onClick={confirmDelete}>
                  Aceptar
                </button>
                <button className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded" onClick={cancelDelete}>
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

export default ProductsPage;
