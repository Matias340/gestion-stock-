import mongoose from 'mongoose';

const GastosSchema = new mongoose.Schema({
    description: { type: String, required: true },
    monto: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  });

export default mongoose.model('gastos', GastosSchema);
