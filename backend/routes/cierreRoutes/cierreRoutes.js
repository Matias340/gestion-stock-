import express from "express";
import {
  crearCierreCaja,
  eliminarCierreCaja,
  obtenerCierresCaja,
} from "../../controllers/cierreDeCajaController/cierreDeCajaController.js"; // Ajusta la ruta si es necesario
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para crear un cierre de caja (protegida por authMiddleware)
router.post("/", authMiddleware, crearCierreCaja);

// Ruta para obtener los cierres de caja (protegida también, opcional)
router.get("/", authMiddleware, obtenerCierresCaja);

router.delete("/:id", authMiddleware, eliminarCierreCaja);

export default router;
