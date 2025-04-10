import express from 'express';
import {
    registro, login, logout
} from '../../controllers/userController/userController.js'

const router = express.Router();

// Rutas CRUD
router.post("/registro", registro);
router.post("/login", login);
router.post("/logout", logout);

export default router;