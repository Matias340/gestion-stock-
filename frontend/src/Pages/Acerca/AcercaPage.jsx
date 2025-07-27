import { ArrowLeft } from "lucide-react";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

const AcercaPage = () => {
  return (
    <Fade triggerOnce={true} delay={50}>
      <div className="flex items-center gap-4">
        <div className="p-6 max-w-xl mx-auto text-gray-700">
          <div className="flex">
            <Link to="/home">
              <ArrowLeft size={30} className="sm:mr-6" />
            </Link>
            <h1 className="text-2xl font-bold mb-4">Acerca de esta aplicación</h1>
          </div>
          <p className="mb-4">
            Esta aplicación fue desarrollada como parte de un sistema de facturación. Algunos íconos utilizados en esta
            aplicación han sido obtenidos de Flaticon.
          </p>

          <h2 className="text-lg font-semibold mb-2">Atribuciones de íconos</h2>

          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/segmento-de-clientes"
                title="segmento de clientes iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Segmento de clientes iconos creados por Elzicon
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/carro"
                title="carro iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Carro iconos creados por joalfa - Flaticon
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/productos-de-higiene"
                title="productos de higiene iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Productos de higiene iconos creados por Freepik
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/proveedor"
                title="proveedor iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Proveedor iconos creados por Iconic Panda
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/libro"
                title="libro iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Libro iconos creados por Smashicons
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/mejora"
                title="mejora iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Mejora iconos creados por zero_wing
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/gasto"
                title="gasto iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Gasto iconos creados por Freepik
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/abierto"
                title="abierto iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Abierto iconos creados por Smashicons
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/interfaz-de-usuario"
                title="interfaz de usuario iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Interfaz de usuario iconos creados por Rizki Ahmad Fauzi
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/sobresalir"
                title="sobresalir iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Sobresalir iconos creados por Pixel perfect
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/pdf"
                title="pdf iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Pdf iconos creados por Roman Káčerek
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
          <ul className="list-disc list-inside text-sm">
            <li>
              Iconos por{" "}
              <a
                href="https://www.flaticon.es/iconos-gratis/factura"
                title="factura iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Factura iconos creados por Eucalyp
              </a>{" "}
              en{" "}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Flaticon
              </a>
              .
            </li>
            {/* Agregá más líneas si usás íconos de otros autores */}
          </ul>
        </div>
      </div>
    </Fade>
  );
};

export default AcercaPage;
