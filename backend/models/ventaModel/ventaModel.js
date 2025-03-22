import mongoose from "mongoose";

const VentaSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "productos" },
      name: String,
      quantity: Number,
      price: Number
    },
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ventas", VentaSchema);