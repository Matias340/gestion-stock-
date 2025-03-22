import express from 'express';
import {
    createProduct,
    getProduct,
    getProductById,
    getProductByBarcode,
    updateProduct,
    deleteProduct,
    
} from '../../controllers/productosController/productoController.js';

const router = express.Router();

// Rutas CRUD
router.post('/', createProduct); // Crear
router.get('/', getProduct); // Obtener todos
router.get('/:id', getProductById); // Obtener por ID
router.get('/barcode/:barcode', getProductByBarcode); // Obtener por BARCODE
router.put('/:id', updateProduct); // Actualizar
router.delete('/:id', deleteProduct); // Eliminar


export default router;