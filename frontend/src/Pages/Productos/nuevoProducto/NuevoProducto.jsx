import React, { useState, useEffect } from "react";
import useProductStore from "../../../store/productStore/productStore";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

function NuevoProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, addProduct, updateProduct, clearCurrentProduct } =
    useProductStore();

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

    if (id) {
      await updateProduct(id, productData);
    } else {
      await addProduct(productData);
    }

    setName("");
    setDescription("");
    setStock("");
    setBarcode("");
    setCost("");
    setPrice("");
    setUnit("");
    setStockAmount("");
    clearCurrentProduct();

    navigate("/products");
  };

  const handleCostChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");

    if (value.length > 1) {
      value = value.replace(/^0+/, "");
    }

    const newCost = value ? Number(value) : "";

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
    <div className="h-[calc(100vh-100px)] flex items-center justify-center mt-10 mb-10">
      <div className="max-h-[560px] overflow-y-auto px-4 bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <Link to="/products">
          <ArrowLeft size={35} className="mr-10" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {id ? "Editar Producto" : "Nuevo Producto"}
        </h1>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-2 text-md font-medium text-gray-900">
              Nombre:
            </label>
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
            <label className="mb-2 text-md font-medium text-gray-900">
              Valor comercial:
            </label>
            <input
              type="text"
              placeholder="Valor comercial"
              value={price}
              onChange={handlePriceChange}
              required
              className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-md font-medium text-gray-900">
              Codigo de barras:
            </label>
            <input
              type="text"
              placeholder="Codigo de barras"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-md font-medium text-gray-900">
              Valor costo:
            </label>
            <input
              type="text"
              placeholder="Valor costo"
              value={cost}
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
            <label className="mb-2 text-md font-medium text-gray-900">
              Stock:
            </label>
            <select
              className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              required
              value={stock}
              onChange={(e) => {
                const newStock = e.target.value;
                setStock(newStock);

                // Si selecciona "Agotado", actualizamos el stockAmount a 0
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
              <div className="mt-4">
                <label className="mb-2 text-md font-medium text-gray-900">
                  Stock actual:
                </label>
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
            <label className="mb-2 text-md font-medium text-gray-900">
              Unidad:
            </label>
            <select
              value={unit}
              required
              onChange={(e) => setUnit(e.target.value)}
              className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="" disabled hidden>
                Seleccionar unidad
              </option>
              <option value="kg">Kilogramo</option>
              <option value="lt">Litro</option>
              <option value="Centimetro">Centimetro</option>
              <option value="Días">Días</option>
              <option value="Horas">Horas</option>
              <option value="Metro">Metro</option>
              <option value="Metro Cuadrado">Metro Cuadrado</option>
              <option value="Metro Cúbico">Metro Cúbico</option>
              <option value="Milimetro">Milimetro</option>
              <option value="Unidad">Unidad</option>
            </select>
          </div>

          <div className="col-span-2 flex flex-col">
            <label className="mb-2 text-md font-medium text-gray-900">
              Descripción:
            </label>
            <textarea
              type="text"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-500 bg-white p-2 rounded-md text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold cursor-pointer py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoProducto;
