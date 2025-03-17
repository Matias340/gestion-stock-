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
    <div className="bg-white mb-3 w-150 flex p-4 rounded-md shadow grid grid-cols-3 gap-2">
      <div>
        <label className="font-bold">Nombre del Producto</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={currentProduct?.name || ""}
          disabled
        />
      </div>
      <div>
        <label className="font-bold">Código de Barras</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={currentProduct?.barcode || ""}
          disabled
        />
      </div>

      <div>
        <label className="font-bold">Precio</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={currentProduct?.price || ""}
          disabled
        />
      </div>
      <div>
        <label className="font-bold">IVA</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="21%"
          disabled
        />
      </div>
      <div>
        <label className="font-bold">Cantidad</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = e.target.value;
            setQuantity(value === "" ? "" : parseInt(value, 10)); // Convierte a número sin ceros iniciales
          }}
          onBlur={() => {
            if (quantity === "" || isNaN(quantity)) {
              setQuantity(1); // Si queda vacío, lo pone en 1
            }
          }}
          min="1"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="font-bold">Stock</label>
        <input
          type="number"
          value={currentProduct?.stockAmount || ""}
          className="w-full p-2 border rounded-md"
        />
      </div>
      {/* Botón de Confirmación */}
      <div className="flex justify-start">
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 font-bold text-white px-2 py-1 shadow-md rounded-md cursor-pointer hover:bg-blue-700"
        >
          Agregar producto
        </button>
      </div>
    </div>
  );
}

export default InformacionProduct;
