import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NuevoProducto from "./Pages/Productos/nuevoProducto/NuevoProducto";
import ProductsPage from "./Pages/Productos/productsPage/ProductsPage";
import VentaPage from "./Pages/ventas/ventaPage/VentaPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HistorialVentasPage from "./Pages/Historial/HistorialVentasPage";
import ProveedoresPage from "./Pages/Proveedores/proveedoresPage/proveedoresPage";
import NuevoProveedor from "./Pages/Proveedores/nuevoProveedor/nuevoProveedor";
import Home from "./Pages/Principal/Home";
import Cards from "./Pages/Principal/Cards";
import NuevoProductoAgregado from "./Pages/Productos/nuevoProductoAgregado/NuevoProductoAgregado";
import IngresosPage from "./Pages/Ingresos/ingresosPage/IngresosPage";
import GastosPage from "./Pages/Gastos/gastosPage/GastosPage";
import EditarGasto from "./Pages/Gastos/editarGasto/EditarGasto";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="">
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Cards />} />
            <Route path="/vender" element={<VentaPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/proveedores" element={<ProveedoresPage />} />
            <Route path="/nuevoProveedor" element={<NuevoProveedor />} />
            <Route path="/nuevoProveedor/:id" element={<NuevoProveedor />} />
            <Route path="/nuevoProducto" element={<NuevoProducto />} />
            <Route
              path="/nuevoProductoAgregado"
              element={<NuevoProductoAgregado />}
            />
            <Route path="/nuevoProducto/:id" element={<NuevoProducto />} />
            <Route path="/historial" element={<HistorialVentasPage />} />
            <Route path="/ingresos" element={<IngresosPage />} />
            <Route path="/gastos" element={<GastosPage />} />
            <Route path="/editarGasto/:id" element={<EditarGasto />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
