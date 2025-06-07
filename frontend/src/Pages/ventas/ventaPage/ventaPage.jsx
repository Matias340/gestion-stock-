import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal"; // Importamos los efectos
import { Link } from "react-router-dom";
import useProductStore from "../../../store/productStore/productStore";
import BuscadorProductos from "./buscadorProductos";
import HistorialVentasPorDia from "./HistorialVentasPorDia";
import InformacionProduct from "./InformacionProduct";
import ListCartProduct from "./ListCartProduct";

export default function VentaPage() {
  const { fetchProduct } = useProductStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchProduct();
    setShowContent(true); // Activamos la animación una vez cargado el contenido
  }, [fetchProduct]);

  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="w-full max-w-screen mx-auto p-4 sm:p-6 bg-gray-100 space-y-6">
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Encabezado */}
            <div className="flex items-center mb-4">
              <Link to="/home">
                <ArrowLeft size={30} className="mr-4 shrink-0" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-semibold">Realizar Venta</h1>
            </div>

            {/* Input oculto para escaneo */}
            <div>
              <input
                type="text"
                className="absolute opacity-0 pointer-events-none"
                placeholder="Escanee el código de barras"
                autoFocus
              />
            </div>

            {/* Buscador de Productos */}
            <div>
              <BuscadorProductos />
            </div>

            {/* Tablero y Info del Producto - Responsive */}
            <Fade triggerOnce={true} delay={100}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 overflow-auto">
                  <InformacionProduct />
                </div>
                <div className="w-full md:w-1/2 overflow-auto">
                  <ListCartProduct />
                </div>
              </div>
            </Fade>

            {/* Historial de Ventas */}
            <Fade triggerOnce={true} delay={100}>
              <div className="w-full">
                <HistorialVentasPorDia />
              </div>
            </Fade>
          </div>
        </div>
      </Fade>
    </>
  );
}
