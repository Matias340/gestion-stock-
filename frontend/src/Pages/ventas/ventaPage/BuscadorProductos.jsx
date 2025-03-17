import { useState } from "react";
import useProductStore from "../../../store/productStore/productStore";

function buscadorProductos() {
  const { products, setCurrentProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const searchValue = e.target.value?.toLowerCase(); // Evita error si es undefined

    if (!searchValue) return; // Si está vacío, salir de la función

    const selectedProduct = products.find(
      (p) => p.name?.toLowerCase() === searchValue
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
      <button className="w-full font-bold cursor-pointer max-w-xs bg-blue-500 text-white py-3 rounded-md shadow-md hover:bg-blue-700">
        Agregar Producto Manualmente
      </button>

      {/* Buscador de Productos Manual */}
      <div className="flex items-center gap-2 justify-end">
        <input
          type="text"
          value={searchTerm}
          list="product-list"
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={handleSearch}
          className="w-70 p-2 border rounded-md text-lg bg-white"
          placeholder="Buscar producto manualmente"
        />
        <datalist id="product-list">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <option
                key={product._id}
                value={product.name || "Producto sin nombre"}
              />
            ))
          ) : (
            <option disabled>No hay productos</option>
          )}
        </datalist>
        <button className="bg-blue-500 font-bold text-white px-4 py-2 cursor-pointer shadow-md rounded-md hover:bg-blue-700">
          Agregar
        </button>
      </div>
    </div>
  );
}

export default buscadorProductos;
