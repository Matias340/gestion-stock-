import express from 'express';
import {
    ventaCompleta,
    getSales
} from '../../controllers/ventasController/ventasController.js'

const router = express.Router();

// Rutas CRUD
router.post('/', ventaCompleta);
router.get('/', getSales);

export default router;