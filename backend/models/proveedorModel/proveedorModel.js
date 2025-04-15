import mongoose from 'mongoose';

const ProveedorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    identify: { type: Number, required: false },
    contact: { type: String, required: false },
    phone: { type: String, required: true },
    adress: { type: String, required: true },
    state: { type: String, enum: ["Activo", "Inactivo"], required: true },
    description: { type: String, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  });

export default mongoose.model('proveedores', ProveedorSchema);
