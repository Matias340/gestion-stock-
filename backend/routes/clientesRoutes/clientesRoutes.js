import express from "express";
import {
  createCliente,
  deleteCliente,
  getCliente,
  getClienteById,
  updateCliente,
} from "../../controllers/clientesController/clientesController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// Rutas CRUD
router.post("/", authMiddleware, createCliente); // Crear
router.get("/", authMiddleware, getCliente); // Obtener todos
router.get("/:id", authMiddleware, getClienteById); // Obtener por ID
router.put("/:id", authMiddleware, updateCliente); // Actualizar
router.delete("/:id", authMiddleware, deleteCliente); // Eliminar

export default router;
