import express from 'express';
import {
    createGasto,
    getGastos,
    getGastoById,
    updateGastos,
    deleteGastos
} from '../../controllers/gastosController/gastosController.js';

const router = express.Router();

router.post('/', createGasto);
router.get('/', getGastos); 
router.get('/:id', getGastoById);
router.put('/:id', updateGastos);
router.delete('/:id', deleteGastos);

export default router;