import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import afipRoutes from "./routes/afipRoutes/afip.routes.js";
import cierreRoutes from "./routes/cierreRoutes/cierreRoutes.js";
import clientesRoutes from "./routes/clientesRoutes/clientesRoutes.js";
import gastosRoutes from "./routes/gastosRoutes/gastosRoutes.js";
import notasCreditoRoutes from "./routes/notaDeCreditoRoutes/notaCreditoRoutes.js";
import productRoutes from "./routes/productRoutes/productRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes/proveedorRoutes.js";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import ventaRoutes from "./routes/ventasRoutes/ventasRoutes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Rutas
app.use("/api/product", productRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/proveedor", proveedorRoutes);
app.use("/api/venta", ventaRoutes);
app.use("/api/gasto", gastosRoutes);
app.use("/api/usuario", userRoutes);
app.use("/api/cierreDeCajas", cierreRoutes);
app.use("/api/afip", afipRoutes);
app.use("/api/notasCredito", notasCreditoRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
