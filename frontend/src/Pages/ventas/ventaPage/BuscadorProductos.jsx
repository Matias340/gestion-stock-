import { useState } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../../../store/productStore/productStore";

function buscadorProductos() {
  const { products, setCurrentProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [barcode, setBarcode] = useState(""); // Agregamos un nuevo estado para el código de barras

  const handleSearch = (e) => {
    const searchValue = e.target.value?.toLowerCase(); // Evita error si es undefined

    if (!searchValue) return; // Si está vacío, salir de la función

    const selectedProduct = products.find((p) => p.name?.toLowerCase() === searchValue);

    if (selectedProduct) {
      setCurrentProduct({
        name: selectedProduct.name,
        price: selectedProduct.price,
        barcode: selectedProduct.barcode,
        stockAmount: selectedProduct.stockAmount,
      });
    }
  };

  // Maneja el código de barras
  const handleBarcodeSearch = (e) => {
    const barcodeValue = e.target.value;
    setBarcode(barcodeValue);

    if (!barcodeValue) return; // Si está vacío, salir de la función

    const selectedProduct = products.find(
      (p) => p.barcode === barcodeValue // Buscamos el producto por código de barras
    );

    if (selectedProduct) {
      setCurrentProduct({
        name: selectedProduct.name,
        price: selectedProduct.price,
        barcode: selectedProduct.barcode,
        stockAmount: selectedProduct.stockAmount,
      });
    }
  };

  return (
    <div className="flex justify-between mt-3 mb-3 gap-4">
      {/* Botón para agregar un producto manualmente */}
      <Link to="/nuevoProductoAgregado">
        <button className="w-full px-4 font-bold cursor-pointer max-w-xs bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700">
          Agregar Producto Manualmente
        </button>
      </Link>

      {/* Buscador de Productos Manual */}
      <div className="flex items-center gap-2 justify-end">
        <input
          type="text"
          value={searchTerm}
          list="product-list"
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={handleSearch}
          className="w-70 p-2 border border-gray-900 border-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-md text-lg bg-white"
          placeholder="Buscar producto manualmente"
        />
        <datalist id="product-list">
          {Array.isArray(products) && products.length > 0 ? (
            products
              .filter((product) => product.stockAmount > 0) // Filtramos productos con stock
              .map((product) => <option key={product._id} value={product.name || "Producto sin nombre"} />)
          ) : (
            <option disabled>No hay productos</option>
          )}
        </datalist>

        {/* Buscador de Código de Barras */}
        <input
          type="text"
          value={barcode}
          onChange={handleBarcodeSearch} // Llamar a la función para buscar por código de barras
          className="w-0 h-0 opacity-0 absolute z-10"
          placeholder="Buscar por Código de Barras"
        />

        <button className="bg-blue-600 font-bold text-white px-4 py-2 cursor-pointer shadow-md rounded-md hover:bg-blue-700">
          Agregar
        </button>
      </div>
    </div>
  );
}

export default buscadorProductos;
