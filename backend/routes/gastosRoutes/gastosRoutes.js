import express from 'express';
import {
    createGasto,
    getGastos,
    getGastoById,
    updateGastos,
    deleteGastos
} from '../../controllers/gastosController/gastosController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createGasto);
router.get('/', authMiddleware, getGastos); 
router.get('/:id', authMiddleware, getGastoById);
router.put('/:id', authMiddleware, updateGastos);
router.delete('/:id', authMiddleware, deleteGastos);

export default router;