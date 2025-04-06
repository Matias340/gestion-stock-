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

  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [cashReceived, setCashReceived] = useState("");

  const total = getTotal();
  const change =
    paymentMethod === "efectivo" ? Math.max(cashReceived - total, 0) : 0;

  const handleCompletePurchase = async (e) => {
    e.preventDefault();

    if (
      paymentMethod === "efectivo" &&
      (cashReceived === "" || cashReceived < total)
    ) {
      toast.error("El dinero recibido debe ser mayor o igual al total.");
      return;
    }

    try {
      const result = await completePurchase(paymentMethod, cashReceived);

      if (result.message === "Venta registrada con éxito") {
        toast.success(result.message); // Mostramos el mensaje de éxito
        setCashReceived("");
      } else {
        toast.error(`Error al completar la venta: ${result.message}`); // Mostramos el error si no es el mensaje esperado
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al procesar la venta");
      console.error("Error en la compra:", error);
    }
  };

  return (
    <div className="bg-white p-4 mb-3 rounded-md shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-3">Productos en la Compra</h2>
      <div className="max-h-60 overflow-y-auto">
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <div
              key={product._id}
              className="p-3 bg-blue-600 mb-2 mr-2 rounded-md flex flex-col"
            >
              <div className="flex justify-between">
                <span className="font-bold text-lg text-white">
                  {product.name}
                </span>
                <button
                  onClick={() => removeFromCart(product._id, product.price)}
                  className="cursor-pointer"
                >
                  <img
                    src={deleteImage}
                    alt="Delete"
                    className="w-7 h-7 bg-red-200 py-1 px-1 rounded-md"
                  />
                </button>
              </div>
              <div className="flex justify-between mt-5">
                <div className=" flex flex-col">
                  <label className="mb-1 font-bold  text-white">
                    Cantidad:
                  </label>
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
                    className="w-16 p-1 border border-gray-900 border-2 bg-white rounded-md text-center"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-md font-semibold  text-white">
                    ${" "}
                    {(product.price * product.quantity).toLocaleString(
                      "es-AR",
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                  <span className="block text-sm text-gray-200">
                    + IVA 21%: ${" "}
                    {(product.price * product.quantity * 0.21).toLocaleString(
                      "es-AR",
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                  <span className="block text-lg font-bold text-white">
                    Total: ${" "}
                    {(product.price * product.quantity * 1.21).toLocaleString(
                      "es-AR",
                      { minimumFractionDigits: 2 }
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay productos en la compra</p>
        )}
      </div>

      <div className="flex flex-col mt-2 mb-2">
        <label className="mb-2 text-md font-medium text-gray-900">
          Medio de pago:
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta débito/crédito</option>
        </select>

        {paymentMethod === "efectivo" && (
          <div className="mt-4">
            <label className="block mb-2 font-medium text-gray-900">
              Dinero Recibido:
            </label>
            <input
              type="text"
              value={cashReceived}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setCashReceived(value);
                }
              }}
              placeholder="Ingrese el monto recibido"
              className="w-full border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            {cashReceived > 0 && (
              <p className="mt-2 text-lg font-semibold text-gray-800">
                Cambio: ${change}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Total de la Compra */}
      <div className="bg-white p-4 rounded-md shadow-md flex justify-between text-lg font-bold">
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
          className="bg-blue-600 mt-3 font-bold text-white px-2 py-1 shadow-md rounded-md cursor-pointer hover:bg-blue-700"
        >
          Completar Venta
        </button>
      </div>
    </div>
  );
}

export default ListCartProduct;
