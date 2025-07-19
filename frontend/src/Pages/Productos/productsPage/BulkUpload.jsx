import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useProductStore from "../../../store/productStore/productStore";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const bulkUploadProducts = useProductStore((state) => state.bulkUploadProducts);

  const handleUpload = async () => {
    if (file) {
      try {
        await bulkUploadProducts(file);
        toast.success("Productos cargados exitosamente", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => navigate("/products"),
        });
      } catch (error) {
        toast.error("Error al subir el archivo", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      toast.warning("Por favor selecciona un archivo", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div>
        <div className="ml-20 mt-5 flex items-center gap-4">
          <Link to="/products">
            <ArrowLeft size={30} className="sm:mr-6" />
          </Link>
        </div>
        <div className="max-w-md mt-5 mb-5 mx-auto bg-white border border-gray-100 rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cargar Productos</h2>
          <p className="text-sm text-gray-500 mb-4">Sube tu archivo Excel o CSV para cargar los productos.</p>

          <label className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-600 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition">
            <svg
              className="w-6 h-6 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8h4m0 0l-4 4m4-4v12"
              />
            </svg>
            <span className="text-sm cursor-pointer">Seleccionar Archivo</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          {file && (
            <p className="mt-3 text-sm text-green-600">
              Archivo seleccionado: <span className="font-medium">{file.name}</span>
            </p>
          )}

          <button
            onClick={handleUpload}
            className="mt-5 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow transition"
          >
            Subir Archivo
          </button>
        </div>
      </div>
    </>
  );
};

export default BulkUpload;
