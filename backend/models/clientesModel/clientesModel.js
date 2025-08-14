import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  codigo: { type: Number, required: true },
  telefono: String,
  email: String,
  notaCredito: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

export default mongoose.model("clientes", ClienteSchema);
