import express from 'express';
import {
    createProduct,
    getProduct,
    getProductById,
    getProductByBarcode,
    updateProduct,
    deleteProduct,
    
} from '../../controllers/productosController/productoController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Rutas CRUD
router.post('/', authMiddleware, createProduct); // Crear
router.get('/', authMiddleware, getProduct); // Obtener todos
router.get('/barcode/:barcode', authMiddleware, getProductByBarcode); // Obtener por BARCODE
router.get('/:id', authMiddleware, getProductById); // Obtener por ID
router.put('/:id', authMiddleware, updateProduct); // Actualizar
router.delete('/:id', authMiddleware, deleteProduct); // Eliminar


export default router;