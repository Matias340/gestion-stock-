import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: String,
  email: String,
  observaciones: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("clientes", ClienteSchema);
