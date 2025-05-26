import mongoose from "mongoose";

const VentaSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "productos" },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: { type: Number, required: true },

  // Opción simple: pago con un solo método
  medioPago: {
    type: String,
    required: true,
    enum: ["efectivo", "tarjeta", "transferencia", "variado"],
  },

  // Si es "variado", acá va el desglose
  pagoDetalle: {
    efectivo: { type: Number, default: 0 },
    tarjeta: { type: Number, default: 0 },
    transferencia: { type: Number, default: 0 },
    // Podés agregar más métodos si necesitás
  },

  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

export default mongoose.model("ventas", VentaSchema);
