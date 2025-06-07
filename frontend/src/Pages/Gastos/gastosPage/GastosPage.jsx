import { ArrowLeft } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import FormularioGasto from "../formularioGasto/FormularioGasto";
import HistorialGastos from "../historialGastos/HistorialGastos";
import ComponenteTotales from "../totales/componenteTotales";

function GastosPage() {
  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="max-h-[500px] max-w-[344px] sm:max-w-full md:max-w-3xl lg:max-w-5xl mx-auto overflow-x-auto overflow-y-auto  p-4  w-full">
          <div className="flex mb-4">
            <Link to="/home">
              <ArrowLeft size={35} className="mr-10" />
            </Link>
            <h1 className="text-2xl font-semibold">Gastos</h1>
          </div>
          <ComponenteTotales />
          <FormularioGasto />
          <HistorialGastos />
        </div>
      </Fade>
    </>
  );
}

export default GastosPage;
