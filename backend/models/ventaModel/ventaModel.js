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
      apellido: String,
      codigo: Number,
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

  detalleVariado: [
    {
      metodo: { type: String, enum: ["efectivo", "tarjeta", "transferencia", "credito"] },
      monto: Number,
    },
  ],

  // Estado general de la venta
  estado: {
    type: String,
    enum: ["pendiente", "cobrado"],
    default: function () {
      const inmediato = ["efectivo", "tarjeta-debito", "transferencia", "credito"];
      return this.medioPago === "variado" ? "cobrado" : inmediato.includes(this.medioPago) ? "cobrado" : "pendiente";
    },
  },

  // Estado de cada parte del pago (solo se usa si es "variado")
  estadoDetalle: {
    efectivo: { type: String, enum: ["pendiente", "cobrado"], default: "cobrado" },
    tarjeta: { type: String, enum: ["pendiente", "cobrado"], default: "cobrado" },
    transferencia: { type: String, enum: ["pendiente", "cobrado"], default: "cobrado" },
    credito: { type: String, enum: ["pendiente", "cobrado"], default: "cobrado" },
  },

  fechaCobro: { type: Date },

  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

// Pre-save: validar y transformar pagoDetalle si es variado
VentaSchema.pre("save", function (next) {
  if (this.medioPago === "variado") {
    // Filtrar solo los métodos usados
    const metodosUsados = Object.entries(this.pagoDetalle)
      .filter(([_, monto]) => monto > 0)
      .map(([metodo, monto]) => ({ metodo, monto }));

    // Validar que la suma coincida con el total
    const sumaDetalle = metodosUsados.reduce((acc, cur) => acc + cur.monto, 0);
    if (sumaDetalle !== this.total) {
      return next(new Error("La suma de los montos en pagoDetalle no coincide con el total."));
    }

    this.detalleVariado = metodosUsados;
  }
  next();
});

// Pre-save: asignar fecha de cobro automáticamente si corresponde
VentaSchema.pre("save", function (next) {
  if (this.estado === "cobrado" && !this.fechaCobro) {
    this.fechaCobro = new Date();
  }
  next();
});

export default mongoose.model("ventas", VentaSchema);
