import express from "express";
import {
  bulkUploadProducts,
  createProduct,
  deleteProduct,
  getProduct,
  getProductByBarcode,
  getProductById,
  updateProduct,
} from "../../controllers/productosController/productoController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

// Rutas CRUD
router.post("/", authMiddleware, createProduct); // Crear
router.get("/", authMiddleware, getProduct); // Obtener todos
router.get("/barcode/:barcode", authMiddleware, getProductByBarcode); // Obtener por BARCODE
router.get("/:id", authMiddleware, getProductById); // Obtener por ID
router.put("/:id", authMiddleware, updateProduct); // Actualizar
router.delete("/:id", authMiddleware, deleteProduct); // Eliminar
router.post("/upload", authMiddleware, upload.single("file"), bulkUploadProducts);

export default router;
