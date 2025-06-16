import express from "express";
import { crearNotaCredito } from "../../controllers/notaDeCreditoController/notaDeCreditoController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// Rutas CRUD
router.post("/", authMiddleware, crearNotaCredito);

export default router;
