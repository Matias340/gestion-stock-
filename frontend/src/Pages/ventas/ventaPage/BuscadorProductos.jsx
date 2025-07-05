import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../../../store/productStore/productStore";

function buscadorProductos() {
  const { products, setCurrentProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [barcode, setBarcode] = useState(""); // Agregamos un nuevo estado para el código de barras
  const barcodeInputRef = useRef(null);
  // Al montar, enfocamos el campo de código de barras
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value?.toLowerCase();
    if (!searchValue) return;

    const selectedProduct = products.find((p) => p.name?.toLowerCase() === searchValue);
    if (selectedProduct) {
      setCurrentProduct(selectedProduct);
    }
  };

  const handleBarcodeKeyDown = (e) => {
    if (e.key === "Enter") {
      const selectedProduct = products.find((p) => p.barcode === barcode.trim());

      if (selectedProduct) {
        setCurrentProduct(selectedProduct);
        setBarcode(""); // Limpiar campo después de buscar
      } else {
        alert("Producto no encontrado.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mt-3 mb-3 gap-4">
      {/* Botón para agregar un producto manualmente */}

      {/* Buscador de Productos Manual */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
        {/* Campo para código de barras (visible solo para depurar) */}
        <input
          type="text"
          ref={barcodeInputRef}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleBarcodeKeyDown}
          className="w-full sm:w-72 p-2 border border-gray-900 border-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-md text-lg bg-white"
          placeholder="Escanear código de barras"
        />

        <Link
          to="/seleccionar-producto"
          className="bg-blue-600 font-bold text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
        >
          Buscar productos
        </Link>
      </div>
    </div>
  );
}

export default buscadorProductos;
