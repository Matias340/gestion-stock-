import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useProductStore from "../../../store/productStore/productStore";

function NuevoProductoAgregado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, addProduct, updateProduct, clearCurrentProduct } = useProductStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [stockAmount, setStockAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && currentProduct) {
      setName(currentProduct.name || "");
      setDescription(currentProduct.description || "");
      setStock(currentProduct.stock || "");
      setBarcode(currentProduct.barcode || "");
      setCost(currentProduct.cost || "");
      setPrice(currentProduct.price || "");
      setUnit(currentProduct.unit || "");
      setStockAmount(currentProduct.stockAmount || "");
    }
  }, [id, currentProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      description,
      stock,
      barcode,
      cost,
      price,
      unit,
      stockAmount,
    };

    try {
      if (id) {
        await updateProduct(id, productData);
        toast.success("Producto actualizado correctamente");
      } else {
        await addProduct(productData);
        toast.success("Producto agregado correctamente");
      }

      // Limpiar formulario
      setName("");
      setDescription("");
      setStock("");
      setBarcode("");
      setCost("");
      setPrice("");
      setUnit("");
      setStockAmount("");
      clearCurrentProduct();

      navigate("/vender");
    } catch (error) {
      toast.error("Ocurrió un error al guardar el producto");
      console.error("Error al guardar producto:", error);
    }
  };

  const handleCostChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");

    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    const newCost = value;

    setCost(newCost);

    if (newCost > price) {
      setError("El valor costo no puede ser mayor que el valor comercial");
    } else {
      setError("");
    }
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9]/g, "");

    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    setPrice(value);
  };

  const handleStockAmountChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }
    setStockAmount(value);
  };

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center mt-4 mb-10 px-4">
          <div className="max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-xl w-full max-w-[800px]">
            <div className="mb-4">
              <Link to="/vender">
                <ArrowLeft size={35} className="text-gray-800 hover:text-blue-600" />
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
              {id ? "Editar Producto" : "Nuevo Producto"}
            </h1>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Nombre:</label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Valor comercial:</label>
                <input
                  type="text"
                  placeholder="Valor comercial"
                  value={
                    price.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || ""
                  }
                  onChange={handlePriceChange}
                  required
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Codigo de barras:</label>
                <input
                  type="text"
                  placeholder="Codigo de barras"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Valor costo:</label>
                <input
                  type="text"
                  placeholder="Valor costo"
                  value={
                    cost.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || ""
                  }
                  required
                  onChange={handleCostChange}
                  className={`border p-2 rounded-md text-gray-900 outline-none focus:ring-1 ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-500 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Stock:</label>
                <select
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                  value={stock}
                  onChange={(e) => {
                    const newStock = e.target.value;
                    setStock(newStock);
                    if (newStock === "Agotado") {
                      setStockAmount(0);
                    }
                  }}
                >
                  <option value="" disabled hidden>
                    Seleccionar stock
                  </option>
                  <option value="Disponible">Disponible</option>
                  <option value="Agotado">Agotado</option>
                </select>

                {stock === "Disponible" && (
                  <div className="mt-4 flex flex-col">
                    <label className="mb-2 text-md font-medium text-gray-900">Stock actual:</label>
                    <input
                      type="text"
                      placeholder="Ingrese cantidad"
                      required
                      value={stockAmount}
                      onChange={handleStockAmountChange}
                      className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Unidad:</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="" disabled hidden>
                    Seleccionar unidad
                  </option>
                  <option value="Kg">Kilogramo</option>
                  <option value="Litros">Litros</option>
                  <option value="Unidad">Unidad</option>
                  <option value="Centimetro">Centímetro</option>
                  <option value="Días">Días</option>
                  <option value="Horas">Horas</option>
                  <option value="Metro">Metro</option>
                  <option value="Metro Cuadrado">Metro Cuadrado</option>
                  <option value="Metro Cúbico">Metro Cúbico</option>
                  <option value="Milimetro">Milímetro</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-md font-medium text-gray-900">Descripción:</label>
                <textarea
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full mb-5 bg-blue-600 text-white font-bold cursor-pointer py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Fade>
    </>
  );
}

export default NuevoProductoAgregado;
