import express from 'express';
import {
    ventaCompleta,
    getSales,
    deleteSales
} from '../../controllers/ventasController/ventasController.js'
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Rutas CRUD
router.post('/', authMiddleware, ventaCompleta);
router.get('/', authMiddleware, getSales);
router.delete('/:id', authMiddleware, deleteSales);

export default router;