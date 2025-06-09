import express from "express";
import {
  deleteSales,
  getSales,
  marcarComoCobrada,
  ventaCompleta,
} from "../../controllers/ventasController/ventasController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// Rutas CRUD
router.post("/", authMiddleware, ventaCompleta); // Crear venta
router.get("/", authMiddleware, getSales); // Obtener ventas (con filtros opcionales)
router.delete("/:id", authMiddleware, deleteSales); // Eliminar venta
router.put("/:id/cobrar", authMiddleware, marcarComoCobrada); // Marcar venta como cobrada

export default router;
