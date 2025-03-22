import { useState } from "react";
import useProductStore from "../../../store/productStore/productStore";
import deleteImage from "../../../assets/delete.png";
import { toast } from "react-toastify";

function ListCartProduct() {
  const {
    selectedProducts,
    updateProductQuantity,
    removeFromCart,
    getTotal,
    completePurchase,
  } = useProductStore();

  const handleCompletePurchase = async () => {
    try {
      const result = await completePurchase();

      // Aquí verificamos si la respuesta contiene el campo 'message'
      if (result.message === "Venta registrada con éxito") {
        toast.success(result.message); // Mostramos el mensaje de éxito
      } else {
        toast.error(`Error al completar la venta: ${result.message}`); // Mostramos el error si no es el mensaje esperado
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al procesar la venta");
      console.error("Error en la compra:", error);
    }
  };

  return (
    <div className="bg-white p-4 mb-3 rounded-md shadow w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-3">Productos en la Compra</h2>
      <div className="max-h-60 overflow-y-auto">
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <div
              key={product._id} // Usamos _id para asegurarnos de que cada producto tenga una clave única
              className="p-3 border-b flex justify-between"
            >
              <span>{product.name}</span>
              <input
                type="number"
                min="1"
                value={product.quantity}
                onChange={(e) =>
                  updateProductQuantity(
                    product._id,
                    product.price,
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-16 p-1 border rounded-md text-center"
              />
              <span>
                {`$${(product.price * product.quantity * 1.21).toLocaleString(
                  "es-AR",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
              </span>
              <button
                onClick={() => removeFromCart(product._id, product.price)}
                className="cursor-pointer"
              >
                <img src={deleteImage} alt="Delete" className="w-6 h-6" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay productos en la compra</p>
        )}
      </div>

      {/* Total de la Compra */}
      <div className="bg-white p-4 rounded-md shadow flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>
          {`$${getTotal().toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        </span>
      </div>
      <div className="flex justify-start">
        <button
          onClick={handleCompletePurchase}
          className="bg-blue-500 mt-3 font-bold text-white px-2 py-1 shadow-md rounded-md cursor-pointer hover:bg-blue-700"
        >
          Completar Venta
        </button>
      </div>
    </div>
  );
}

export default ListCartProduct;
