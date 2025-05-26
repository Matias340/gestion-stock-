import mongoose from "mongoose";

// Unidades permitidas (para referencia y validación)
const UNIDADES_VALIDAS = [
  "Kg",
  "Litros",
  "Unidad",
  "Centimetro",
  "Días",
  "Horas",
  "Metro",
  "Metro Cuadrado",
  "Metro Cúbico",
  "Milimetro",
];

const ProductoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  barcode: { type: String, unique: true, required: false, trim: true },
  cost: { type: Number, required: true },
  stock: { type: String, enum: ["Disponible", "Agotado"], required: true },
  stockAmount: { type: Number, default: 0 }, // Solo si está "Disponible"
  unit: {
    type: String,
    enum: UNIDADES_VALIDAS,
    required: true,
  },
  description: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

// Middleware para validar stockAmount y normalizar la unidad
ProductoSchema.pre("save", function (next) {
  // Si el producto está agotado, el stock debe ser 0
  if (this.stock === "Agotado") {
    this.stockAmount = 0;
  }

  // Normalizar la unidad: capitalizar la primera letra, minúsculas el resto
  if (this.unit) {
    const normalizado = this.unit.charAt(0).toUpperCase() + this.unit.slice(1).toLowerCase();
    if (UNIDADES_VALIDAS.includes(normalizado)) {
      this.unit = normalizado;
    } else {
      // Si la unidad normalizada no es válida, lanzar un error
      return next(new Error(`La unidad "${this.unit}" no es válida. Debe ser una de: ${UNIDADES_VALIDAS.join(", ")}`));
    }
  }

  next();
});

export default mongoose.model("productos", ProductoSchema);
