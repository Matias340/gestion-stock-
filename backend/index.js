import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes/productRoutes.js';
import proveedorRoutes from './routes/proveedorRoutes/proveedorRoutes.js';
import ventaRoutes from './routes/ventasRoutes/ventasRoutes.js';


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/product', productRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/venta', ventaRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});