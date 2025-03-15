import { useState, useEffect } from "react";
import useProductStore from "../../../store/productStore/productStore";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Facturacion() {
  const { products, fetchProduct, setCurrentProduct, currentProduct } =
    useProductStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

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
    <div className="max-w-full mx-auto p-6 bg-gray-100 space-y-6">
      <div className="max-h-[540px] overflow-y-auto">
        <div className="flex">
          <Link to="/">
            <ArrowLeft size={35} className="mr-10" />
          </Link>
          <h1 className="text-2xl font-semibold">Facturación</h1>
        </div>

        {/* Escaneo del Código de Barras */}
        <div className="">
          <input
            type="text"
            className="absolute opacity-0 pointer-events-none"
            placeholder="Escanee el código de barras"
            autoFocus
          />
        </div>

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
              Buscar
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          {/* Tablero de Productos Seleccionados */}
          <div className="bg-white p-4 mb-3 rounded-md shadow w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-3">
              Productos en la Compra
            </h2>
            <div className="max-h-60 overflow-y-auto">
              {/* Aquí se listarán los productos agregados */}
              <div className="p-3 border-b flex justify-between">
                <span>Producto 1</span>
                <span>$100</span>
              </div>
              <div className="p-3 border-b flex justify-between">
                <span>Producto 2</span>
                <span>$200</span>
              </div>
            </div>

            {/* Total de la Compra */}
            <div className="bg-white p-4 rounded-md shadow flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>$300</span>
            </div>
            <div className="flex justify-start">
              <button className="bg-blue-500 mt-3 font-bold text-white px-2 py-1 shadow-md rounded-md cursor-pointer hover:bg-blue-700">
                Completar Venta
              </button>
            </div>
          </div>

          {/* Información del Producto */}
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
              <input type="number" className="w-full p-2 border rounded-md" />
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
              <button className="bg-blue-500 font-bold text-white px-2 py-1 shadow-md rounded-md cursor-pointer hover:bg-blue-700">
                Agregar producto
              </button>
            </div>
          </div>
        </div>

        {/* Historial de Ventas */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="text-xl font-bold mb-4">
            Historial de Ventas del Día
          </h3>
          <div className="max-h-60 overflow-y-auto rounded-sm">
            <table className="w-full border-collapse">
              <thead className="text-center">
                <tr className="bg-blue-600 rounded-md">
                  <th className="p-2 border border-blue-600 text-white">
                    Código
                  </th>
                  <th className="p-2 border border-blue-600 text-white">
                    Producto
                  </th>
                  <th className="p-2 border border-blue-600 text-white">
                    Cantidad
                  </th>
                  <th className="p-2 border border-blue-600 text-white">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* Aquí se llenará el historial de ventas */}
                <tr className="border border-gray-200 odd:bg-gray-200 even:bg-white">
                  <td className="p-2 font-bold">ABC123</td>
                  <td className="p-2 font-bold">Ejemplo Producto</td>
                  <td className="p-2 font-bold">2</td>
                  <td className="p-2 font-bold">$1000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
