import { ArrowLeft } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import ComponenteTotales from "../totales/componenteTotales";
import FormularioGasto from "../formularioGasto/FormularioGasto";
import HistorialGastos from "../historialGastos/HistorialGastos";

function GastosPage() {
  return (
    <>
      <Fade triggerOnce={true} delay={50}>
        <div className="max-h-[510px] overflow-y-auto bg-white p-4 shadow-md rounded-md w-full">
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
