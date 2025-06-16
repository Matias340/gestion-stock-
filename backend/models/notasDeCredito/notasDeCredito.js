import mongoose from "mongoose";

const NotaCreditoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "clientes", required: true },
  fecha: { type: Date, default: Date.now },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "productos", required: true },
      nombre: { type: String, required: true }, // Se guarda el nombre en el momento de la devolución
      cantidad: { type: Number, required: true },
      precioUnitario: { type: Number, required: true },
      subtotal: { type: Number, required: true }, // cantidad * precioUnitario
    },
  ],
  total: { type: Number, required: true },
  motivo: { type: String },
  observaciones: String,
  procesadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

export default mongoose.model("notasCredito", NotaCreditoSchema);
