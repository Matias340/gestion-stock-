import express from 'express';
import {
    ventaCompleta,
    getSales,
    deleteSales
} from '../../controllers/ventasController/ventasController.js'

const router = express.Router();

// Rutas CRUD
router.post('/', ventaCompleta);
router.get('/', getSales);
router.delete('/:id', deleteSales);

export default router;