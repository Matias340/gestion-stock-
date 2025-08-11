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
  clientes: [
    {
      clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "clientes" },
      nombre: String,
      email: String,
      notaCredito: Number,
    },
  ],
  total: { type: Number, required: true },

  medioPago: {
    type: String,
    required: true,
    enum: ["efectivo", "tarjeta-credito", "tarjeta-debito", "transferencia", "credito", "variado"],
  },

  pagoDetalle: {
    efectivo: { type: Number, default: 0 },
    tarjeta: { type: Number, default: 0 },
    transferencia: { type: Number, default: 0 },
    credito: { type: Number, default: 0 },
  },

  // Estado general de la venta
  estado: {
    type: String,
    enum: ["pendiente", "cobrado"],
    default: function () {
      const inmediato = ["efectivo", "tarjeta-debito", "transferencia", "credito", "variado"];
      return inmediato.includes(this.medioPago) ? "cobrado" : "pendiente";
    },
  },

  // Estado de cada parte del pago (solo se usa si es "variado")
  estadoDetalle: {
    efectivo: { type: String, enum: ["pendiente", "cobrado"], default: "cobrado" },
    tarjeta: { type: String, enum: ["pendiente", "cobrado"], default: "pendiente" },
    transferencia: { type: String, enum: ["pendiente", "cobrado"], default: "cobrado" },
    credito: { type: String, enum: ["pendiente", "cobrado"], default: "cobrado" },
  },

  fechaCobro: { type: Date },

  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

// Validación: suma de pagoDetalle debe coincidir con total (solo si medioPago === 'variado')
VentaSchema.pre("save", function (next) {
  if (this.medioPago === "variado") {
    const sumaDetalle =
      (this.pagoDetalle.efectivo || 0) +
      (this.pagoDetalle.tarjeta || 0) +
      (this.pagoDetalle.transferencia || 0) +
      (this.pagoDetalle.credito || 0);

    if (sumaDetalle !== this.total) {
      return next(new Error("La suma de los montos en pagoDetalle no coincide con el total."));
    }
  }
  next();
});

// Asignar fecha de cobro automáticamente si corresponde
VentaSchema.pre("save", function (next) {
  if (this.estado === "cobrado" && !this.fechaCobro) {
    this.fechaCobro = new Date();
  }
  next();
});

export default mongoose.model("ventas", VentaSchema);
