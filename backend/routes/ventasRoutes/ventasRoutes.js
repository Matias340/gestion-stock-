import express from 'express';
import {
    ventaCompleta
} from '../../controllers/ventasController/ventasController.js'

const router = express.Router();

// Rutas CRUD
router.post('/complete-sale', ventaCompleta);

export default router;