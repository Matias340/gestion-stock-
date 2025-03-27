import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Principal/Home";
import NuevoProducto from "./Pages/Productos/nuevoProducto/NuevoProducto";
import ProductsPage from "./Pages/Productos/productsPage/ProductsPage";
import VentaPage from "./Pages/ventas/ventaPage/VentaPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HistorialVentasPage from "./Pages/Historial/HistorialVentasPage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venta" element={<VentaPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/nuevoProducto" element={<NuevoProducto />} />
          <Route path="/nuevoProducto/:id" element={<NuevoProducto />} />
          <Route path="/historial" element={<HistorialVentasPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
