import mongoose from "mongoose";

const CierreCajaSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  ventasTotales: { type: Number, required: true },
  efectivoInicial: { type: Number, required: true },
  efectivoFinal: { type: Number, required: true },
  ingresosAdicionales: { type: Number, default: 0 },
  gastos: { type: Number, default: 0 },
  metodoPago: {
    efectivo: { type: Number, default: 0 },
    tarjeta: { type: Number, default: 0 },
    transferencia: { type: Number, default: 0 },
    variado: { type: Number, default: 0 },
  },
  notas: { type: String },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

export default mongoose.model("cierres", CierreCajaSchema);
