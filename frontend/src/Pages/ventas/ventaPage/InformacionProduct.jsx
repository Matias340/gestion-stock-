import { useState } from "react";
import useProductStore from "../../../store/productStore/productStore";

function InformacionProduct() {
  const { fetchProduct, currentProduct, addToProduct } = useProductStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddProduct = () => {
    if (currentProduct && quantity > 0) {
      addToProduct(currentProduct, quantity);
    }
  };

  return (
    <div className="bg-white mb-3 w-145 p-4 rounded-md shadow-lg grid grid-cols-3 gap-4">
      <div>
        <label className="font-bold">Nombre del Producto</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-900 border-2 font-sans rounded-md"
          value={currentProduct?.name || ""}
          disabled
        />
      </div>
      <div>
        <label className="font-bold">Código de Barras</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-900 border-2 rounded-md"
          value={currentProduct?.barcode || ""}
          disabled
        />
      </div>
      <div>
        <label className="font-bold">Precio</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-900 border-2 rounded-md"
          value={
            currentProduct?.price.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || ""
          }
          disabled
        />
      </div>
      <div>
        <label className="font-bold">IVA</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-900 border-2 rounded-md"
          placeholder="21%"
          disabled
        />
      </div>
      <div>
        <label className="font-bold">Stock</label>
        <input
          type="number"
          value={currentProduct?.stockAmount || ""}
          className="w-full p-2 border border-gray-900 border-2 rounded-md"
          disabled
        />
      </div>

      {/* Botón debajo de todos los inputs, alineado a la izquierda */}
      <div className="col-span-3 flex justify-start">
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 font-bold text-white px-4 py-2 shadow-md rounded-md cursor-pointer hover:bg-blue-700"
        >
          Agregar producto
        </button>
      </div>
    </div>
  );
}

export default InformacionProduct;
