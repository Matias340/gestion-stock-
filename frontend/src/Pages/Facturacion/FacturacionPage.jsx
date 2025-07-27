import { ArrowLeft } from "lucide-react";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

const FacturacionPage = () => {
  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="mt-10">
        <div className="flex items-center gap-4 ml-10 mb-10">
          <Link to="/home">
            <ArrowLeft size={30} className="sm:mr-6" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold">Facturación</h1>
        </div>
        <div className="bg-blue-500 text-center font-bold text-lg text-white pt-2 pb-2 rounded-lg shadow-lg max-w-sm lg:max-w-2xl mx-auto">
          <h1>Generar Certificado</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-10">
          <div className="bg-blue-500 text-center text-white pt-2 pb-2 rounded-lg shadow-lg w-[300px]">
            <h1 className="font-bold text-lg">Datos Personales</h1>
            <h2 className="mt-2 text-sm">Muestra tus Datos Personales</h2>
          </div>
          <div className="bg-blue-500 text-center text-white pt-2 pb-2 rounded-lg shadow-lg w-[300px]">
            <h1 className="font-bold text-lg">Subir Certificado</h1>
            <h2 className="mt-2 text-sm">Subir Certificado PFX</h2>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-5">
          <div className="bg-blue-500 text-center text-white pt-2 pb-2 rounded-lg shadow-lg w-[300px]">
            <h1 className="text-lg font-bold">Notas de Credito</h1>
            <h2 className="mt-2 text-sm">Emite Notas de Credito</h2>
          </div>
          <div className="bg-blue-500 text-center text-white pt-2 pb-2 rounded-lg shadow-lg w-[300px]">
            <h1 className="text-lg font-bold">Historial de Facturas</h1>
            <h2 className="mt-2 text-sm">Muestra el historial de facturas</h2>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default FacturacionPage;
