import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import deleteImage from "../../../assets/delete.png";
import useClienteStore from "../../../store/clientesStore/clientesStore";
import useProductStore from "../../../store/productStore/productStore";
import useVentaStore from "../../../store/ventaStore/ventaStore";

function ListCartProduct() {
  const {
    selectedProducts,
    updateProductQuantity,
    removeFromCart,
    getTotal,
    completePurchase,
    paymentMethod,
    userId,
    setPaymentMethod,
  } = useProductStore();
  const { clientes, setCurrentClientes, currentClientes } = useClienteStore();
  const { fetchVentaDetails } = useVentaStore();
  const [varMethod1, setVarMethod1] = useState("");
  const [varMethod2, setVarMethod2] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const total = getTotal();
  const change = paymentMethod === "efectivo" ? Math.max(cashReceived - total, 0) : 0;

  const handleCompletePurchase = async (e) => {
    e.preventDefault();

    try {
      let paymentDetail = null;

      // 1️⃣ Pago en efectivo
      if (paymentMethod === "efectivo") {
        if (cashReceived === "" || parseFloat(cashReceived) < total) {
          toast.error("El dinero recibido debe ser mayor o igual al total.");
          return;
        }
        paymentDetail = { efectivo: total };
      }

      // 2️⃣ Pago con crédito
      if (paymentMethod === "credito") {
        const creditoDisponible = currentClientes?.notaCredito || 0;
        if (creditoDisponible < total) {
          toast.error("Crédito insuficiente para completar la compra.");
          return;
        }
        paymentDetail = { credito: total };
      }

      // 3️⃣ Pago variado (ej: efectivo + crédito)
      if (paymentMethod === "variado") {
        if (!varMethod1 || !varMethod2) {
          toast.error("Debes seleccionar ambos métodos de pago.");
          return;
        }

        const monto1 = parseFloat(cashReceived || 0); // monto ingresado para el primer método
        const monto2 = total - monto1; // el resto se asume para el segundo método

        if (monto1 <= 0 || monto2 <= 0 || monto1 + monto2 !== total) {
          toast.error("Los montos de pago no coinciden con el total.");
          return;
        }

        paymentDetail = {
          [varMethod1]: monto1,
          [varMethod2]: monto2,
        };
      }

      // 4️⃣ Llamada al store
      const result = await completePurchase(paymentDetail);

      if (result.message === "Venta registrada con éxito") {
        toast.success(result.message);
        setCashReceived(""); // reset input
        await fetchVentaDetails();
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
            <div key={product._id} className="p-3 bg-blue-600 mb-2 mr-2 rounded-md flex flex-col">
              <div className="flex justify-between">
                <span className="font-bold text-lg text-white">{product.name}</span>
                <button onClick={() => removeFromCart(product._id, product.price)} className="cursor-pointer">
                  <img src={deleteImage} alt="Delete" className="w-7 h-7 bg-red-200 py-1 px-1 rounded-md" />
                </button>
              </div>
              <div className="flex justify-between mt-5">
                <div className=" flex flex-col">
                  <label className="mb-1 font-bold  text-white">Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => updateProductQuantity(product._id, product.price, parseInt(e.target.value, 10))}
                    className="w-16 p-1 border border-gray-900 border-2 bg-white rounded-md text-center"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-md font-semibold  text-white">
                    $ {(product.price * product.quantity).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-sm text-gray-200">
                    + IVA 21%: ${" "}
                    {(product.price * product.quantity * 0.21).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-lg font-bold text-white">
                    Total: ${" "}
                    {(product.price * product.quantity * 1.21).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
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
        <label className="mb-2 text-md font-medium text-gray-900">Medio de pago:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta-debito">Tarjeta débito</option>
          <option value="tarjeta-credito">Tarjeta crédito</option>
          <option value="transferencia">Transferencia</option>
          <option value="credito">Credito</option>
          <option value="variado">Variado</option>
        </select>

        {/* Efectivo */}
        {paymentMethod === "efectivo" && (
          <div className="mt-4">
            <label className="block mb-2 font-medium text-gray-900">Dinero Recibido:</label>
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
            {cashReceived > 0 && <p className="mt-2 text-lg font-semibold text-green-600">Cambio: ${change}</p>}
          </div>
        )}

        {/* Crédito */}
        {paymentMethod === "credito" && (
          <div className="mt-4">
            <label className="block mb-2 font-medium text-gray-900">Crédito disponible:</label>
            <div className="flex">
              <input
                type="text"
                value={
                  currentClientes?.notaCredito.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || ""
                }
                readOnly
                className="flex-1 border mr-2 border-gray-900 border-2 p-2 rounded-md bg-gray-100 text-gray-700 outline-none"
              />
              <input
                type="text"
                value={currentClientes?.codigo}
                readOnly
                className="flex-1 border border-gray-900 border-2 p-1 rounded-md bg-gray-100 text-gray-700 outline-none"
              />
            </div>
            <div className="mt-5">
              <Link
                to="/seleccionar-cliente"
                className="bg-blue-600 font-bold text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
              >
                Seleccionar cliente
              </Link>
            </div>
          </div>
        )}

        {/* Variado */}
        {paymentMethod === "variado" && (
          <div className="mt-4 space-y-4">
            {[
              { label: "Primer método", value: varMethod1, set: setVarMethod1 },
              { label: "Segundo método", value: varMethod2, set: setVarMethod2 },
            ].map((m, idx) => (
              <div key={idx}>
                <label className="block mb-2 font-medium text-gray-900">{m.label}:</label>
                <select
                  value={m.value}
                  onChange={(e) => m.set(e.target.value)}
                  className="w-full border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Seleccione...</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta-debito">Tarjeta débito</option>
                  <option value="tarjeta-credito">Tarjeta crédito</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="credito">Crédito</option>
                </select>

                {/* Efectivo dentro de variado */}
                {m.value === "efectivo" && (
                  <div className="mt-2">
                    <label className="block mb-2 font-medium text-gray-900">Dinero Recibido:</label>
                    <input
                      type="text"
                      value={cashReceived}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^-?\d*\.?\d*$/.test(value)) {
                          setCashReceived(value);
                        }
                      }}
                      placeholder="Ingrese el monto recibido"
                      className="w-full border border-gray-900 border-2 p-2 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                )}

                {/* Crédito dentro de variado */}
                {m.value === "credito" && (
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={
                          currentClientes?.notaCredito.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || ""
                        }
                        readOnly
                        className="flex-1 border border-gray-900 border-2 p-2 rounded-md bg-gray-100 text-gray-700 outline-none"
                      />
                      <input
                        type="text"
                        value={currentClientes?.codigo}
                        readOnly
                        className="flex-1 border border-gray-900 border-2 p-1 rounded-md bg-gray-100 text-gray-700 outline-none"
                      />
                    </div>
                    <Link
                      to="/seleccionar-cliente"
                      className="bg-blue-600 font-bold text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 w-full text-center"
                    >
                      Seleccionar cliente
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total de la Compra */}
      <div className="bg-white p-2 flex justify-between text-lg font-bold">
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
