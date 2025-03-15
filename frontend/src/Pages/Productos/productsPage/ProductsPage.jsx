import { useState, useEffect } from "react";
import useProductStore from "../../../store/productStore/productStore";
import { Filter, Plus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function ProductsPage() {
  const { products, fetchProduct, removeProduct, setCurrentProduct } =
    useProductStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  // Función para confirmar la eliminación
  const confirmDelete = () => {
    if (productToDelete) {
      removeProduct(productToDelete._id);
      setShowModal(false);
      setProductToDelete(null);
    }
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  //filtro
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filterText.toLowerCase()) ||
      product.price.toString().includes(filterText) ||
      //product.stockAmount.toString().includes(filterText) ||
      product.barcode.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <Link to="/">
            <ArrowLeft size={35} className="mr-10" />
          </Link>
          <h1 className="text-2xl font-semibold">Productos</h1>
        </div>
        <Link to="/nuevoProducto">
          <button className="flex font-bold items-center gap-2 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            <Plus size={20} /> Nuevo Producto
          </button>
        </Link>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          placeholder="Filtrar producto por Nombre, Precio o Codigo de barras"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
        <Filter size={20} className="absolute left-3 top-2.5 text-gray-900" />
      </div>
      <div className="max-h-[400px] overflow-y-auto w-full px-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-blue-500 p-4 mt-5 rounded-lg shadow-md w-full grid grid-cols-3 items-center gap-4"
            >
              <div className="col-span-1">
                <h2 className="text-lg text-white font-bold">{product.name}</h2>
                <p className="text-white font-bold">
                  ARS$ {new Intl.NumberFormat("es-AR").format(product.price)}
                </p>
                <p className="text-white font-bold">
                  Código: {product.barcode}
                </p>
              </div>
              <div className="col-span-1 text-center text-white">
                <span className="font-bold">
                  Stock:{" "}
                  {product.stockAmount > 0 ? product.stockAmount : "Agotado"}
                </span>
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-sm font-bold border border-white rounded bg-white text-blue-500 cursor-pointer"
                  onClick={() => {
                    setCurrentProduct(product);
                    navigate(`/nuevoProducto/${product._id}`);
                  }}
                >
                  Editar
                </button>
                <button
                  className="px-4 py-2 text-sm font-bold border border-red-500 rounded bg-red-500 text-white cursor-pointer"
                  onClick={() => handleDeleteClick(product)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No se encontraron productos.
          </p>
        )}
      </div>
      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              ¿Seguro que quieres eliminar este producto?
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
  );
}

export default ProductsPage;
