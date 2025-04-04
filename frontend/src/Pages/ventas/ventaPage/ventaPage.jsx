import { useState, useEffect } from "react";
import useProductStore from "../../../store/productStore/productStore";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BuscadorProductos from "./buscadorProductos";
import ListCartProduct from "./ListCartProduct";
import InformacionProduct from "./InformacionProduct";
import HistorialVentasPorDia from "./HistorialVentasPorDia";
import { Fade, Slide } from "react-awesome-reveal"; // Importamos los efectos

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
        <div className="max-w-full mx-auto p-6 bg-gray-100 space-y-6">
          <div className="max-h-[480px] overflow-y-auto">
            <div className="flex">
              <Link to="/">
                <ArrowLeft size={35} className="mr-10" />
              </Link>
              <h1 className="text-2xl font-semibold">Realizar Venta</h1>
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

            {/* Buscador de los Productos */}
            <div>
              <BuscadorProductos />
            </div>

            {/* Usamos Fade y Slide para animar los componentes */}
            <Fade triggerOnce={true} delay={100}>
              <div className="flex justify-between gap-4">
                {/* Tablero de Productos Seleccionados */}
                <div className="w-1/2 overflow-auto">
                  <ListCartProduct />
                </div>
                {/* Información del Producto */}
                <div className="w-1/2 overflow-auto">
                  <InformacionProduct />
                </div>
              </div>
            </Fade>

            <Fade triggerOnce={true} delay={100}>
              <div>
                <HistorialVentasPorDia />
              </div>
            </Fade>
          </div>
        </div>
      </Fade>
    </>
  );
}
