import Venta from "../../models/ventaModel/ventaModel.js";

export const ventaCompleta = async (req, res) => {
  try {
    const { products, total } = req.body;

    // Validaciones básicas
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No hay productos en la venta" });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ message: "El total no es válido" });
    }

    // Guardar la venta en la base de datos
    const newVenta = new Venta({ products, total });
    await newVenta.save();

    res.status(201).json({ message: "Venta registrada con éxito", sale: newVenta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar la venta" });
  }
};