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
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState(""); // Para agregar métodos
  const total = getTotal();

  // Suma total de los pagos ingresados
  const totalPaid = paymentMethods.reduce(
    (sum, p) => sum + parseFloat(p.amount || 0),
    0
  );

  const change = Math.max(totalPaid - total, 0);

  // Agregar un nuevo método de pago
  const addPaymentMethod = () => {
    if (
      newPaymentMethod &&
      !paymentMethods.some((p) => p.method === newPaymentMethod)
    ) {
      setPaymentMethods([
        ...paymentMethods,
        { method: newPaymentMethod, amount: "" },
      ]);
      setNewPaymentMethod("");
    }
  };

  // Actualizar monto de un método de pago
  const updatePaymentAmount = (index, amount) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods[index].amount = amount;
    setPaymentMethods(updatedMethods);
  };

  // Eliminar un método de pago
  const removePaymentMethod = (index) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const handleCompletePurchase = async (e) => {
    e.preventDefault();

    if (totalPaid < total) {
      toast.error(
        "El monto total pagado debe ser igual o mayor al total de la compra."
      );
      return;
    }

    try {
      const result = await completePurchase(paymentMethods);

      if (result.message === "Venta registrada con éxito") {
        toast.success(result.message);
        setPaymentMethods([]); // Reset pagos
      } else {
        toast.error(`Error al completar la venta: ${result.message}`);
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
          Métodos de pago:
        </label>

        <div className="flex gap-2">
          <select
            value={newPaymentMethod}
            onChange={(e) => setNewPaymentMethod(e.target.value)}
            className="border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Seleccione un método</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta débito/crédito</option>
            <option value="transferencia">Transferencia</option>
          </select>
          <button
            onClick={addPaymentMethod}
            className="px-4 py-2 bg-blue-600 cursor-pointer font-bold text-white rounded-md hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>

        {paymentMethods.map((payment, index) => (
          <div key={index} className="mt-4 flex flex-col">
            <label className="block mb-2 font-medium text-gray-900">
              {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
              :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={payment.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    updatePaymentAmount(index, value);
                  }
                }}
                placeholder="Ingrese el monto"
                className="border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <button
                onClick={() => removePaymentMethod(index)}
                className="cursor-pointer"
              >
                <img
                  src={deleteImage}
                  alt="Delete"
                  className="w-7 h-7 py-1 px-1 "
                />
              </button>
            </div>
          </div>
        ))}

        <p className="mt-4 font-semibold text-gray-800">
          Total a pagar: $
          {`${getTotal().toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        </p>
        <p className="font-semibold text-gray-800">
          Total pagado: $
          {`${totalPaid.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        </p>
        {change > 0 && (
          <p className="text-lg font-semibold text-green-600">
            Cambio: $
            {`${change.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </p>
        )}

        <button
          onClick={handleCompletePurchase}
          className="mt-4 px-4 py-2 cursor-pointer font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Completar compra
        </button>
      </div>
    </div>
  );
}

export default ListCartProduct;
