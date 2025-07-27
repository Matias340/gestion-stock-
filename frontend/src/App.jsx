import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AcercaPage from "./Pages/Acerca/AcercaPage";
import CierreDeCajaPage from "./Pages/CierreDeCaja/CierreDeCajaPage";
import ClientesPage from "./Pages/Clientes/ClientesPage";
import NuevoClientes from "./Pages/Clientes/nuevosClientes/nuevosClientes";
import FacturacionPage from "./Pages/Facturacion/FacturacionPage";
import EditarGasto from "./Pages/Gastos/editarGasto/EditarGasto";
import GastosPage from "./Pages/Gastos/gastosPage/GastosPage";
import HistorialVentasPage from "./Pages/Historial/HistorialVentasPage";
import IngresosPage from "./Pages/Ingresos/ingresosPage/IngresosPage";
import Login from "./Pages/login/Login";
import Cards from "./Pages/Principal/Cards";
import Home from "./Pages/Principal/Home";
import NuevoProducto from "./Pages/Productos/nuevoProducto/NuevoProducto";
import NuevoProductoAgregado from "./Pages/Productos/nuevoProductoAgregado/NuevoProductoAgregado";
import BulkUpload from "./Pages/Productos/productsPage/BulkUpload";
import ProductsPage from "./Pages/Productos/productsPage/ProductsPage";
import SeleccionarProducto from "./Pages/Productos/seleccionarProducto/seleccionarProducto";
import NuevoProveedor from "./Pages/Proveedores/nuevoProveedor/nuevoProveedor";
import ProveedoresPage from "./Pages/Proveedores/proveedoresPage/proveedoresPage";
import VentaPage from "./Pages/ventas/ventaPage/VentaPage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Rutas protegidas con layout que contiene Navbar */}
          <Route path="/" element={<Home />}>
            <Route path="home" element={<Cards />} />
            <Route path="vender" element={<VentaPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="acerca" element={<AcercaPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="nuevoProveedor" element={<NuevoProveedor />} />
            <Route path="nuevoProveedor/:id" element={<NuevoProveedor />} />
            <Route path="nuevoCliente" element={<NuevoClientes />} />
            <Route path="nuevoCliente/:id" element={<NuevoClientes />} />
            <Route path="nuevoProducto" element={<NuevoProducto />} />
            <Route path="cargarProductos" element={<BulkUpload />} />
            <Route path="nuevoProductoAgregado" element={<NuevoProductoAgregado />} />
            <Route path="seleccionar-producto" element={<SeleccionarProducto />} />
            <Route path="nuevoProducto/:id" element={<NuevoProducto />} />
            <Route path="historial" element={<HistorialVentasPage />} />
            <Route path="ingresos" element={<IngresosPage />} />
            <Route path="gastos" element={<GastosPage />} />
            <Route path="editarGasto/:id" element={<EditarGasto />} />
            <Route path="cierre" element={<CierreDeCajaPage />} />
            <Route path="facturacion" element={<FacturacionPage />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
