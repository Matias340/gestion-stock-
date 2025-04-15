import express from 'express';
import {
    createProveedor,
    getProveedor,
    getProveedorById,
    getProveedorByName,
    updateProveedor,
    deleteProveedor,
    
} from '../../controllers/proveedorController/proveedorController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Rutas CRUD
router.post('/', authMiddleware, createProveedor); 
router.get('/', authMiddleware, getProveedor); 
router.get('/:id', authMiddleware, getProveedorById); 
router.get('/name/:name', authMiddleware, getProveedorByName); 
router.put('/:id', authMiddleware, updateProveedor); 
router.delete('/:id', authMiddleware, deleteProveedor); 


export default router;