import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    barcode: { type: String, unique: true, required: false, trim: true},
    cost: { type: Number, required: true },
    stock: { type: String, enum: ["Disponible", "Agotado"], required: true },
    stockAmount: { type: Number, default: 0 }, // Solo si está "Disponible"
    unit: { 
      type: String, 
      enum: ["Kg", "Litros", "Unidad", "Centimetro", "Días", "Horas", "Metro", "Metro Cuadrado", "Metro Cúbico", "Milimetro"], 
      required: true
    },
    description: { type: String, required: false }
  });
  
  // Middleware para validar stock
  ProductoSchema.pre("save", function(next) {
    if (this.stock === "Agotado") {
      this.stockAmount = 0; // Si está agotado, stock debe ser 0
    }
    next();
  });

// Exportar el modelo
export default mongoose.model('productos', ProductoSchema);
