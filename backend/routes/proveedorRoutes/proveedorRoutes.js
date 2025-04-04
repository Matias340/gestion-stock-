import express from 'express';
import {
    createProveedor,
    getProveedor,
    getProveedorById,
    getProveedorByName,
    updateProveedor,
    deleteProveedor,
    
} from '../../controllers/proveedorController/proveedorController.js';

const router = express.Router();

// Rutas CRUD
router.post('/', createProveedor); 
router.get('/', getProveedor); 
router.get('/:id', getProveedorById); 
router.get('/name/:name', getProveedorByName); 
router.put('/:id', updateProveedor); 
router.delete('/:id', deleteProveedor); 


export default router;