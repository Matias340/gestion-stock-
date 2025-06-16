import NotaCredito from "../../models/notasDeCredito/notasDeCredito.js";
import Producto from "../../models/productoModel/productoModel.js";

export const crearNotaCredito = async (req, res) => {
  try {
    const { clienteId, productos, motivo, observaciones, procesadoPor } = req.body;

    // Calcular subtotales y total, y actualizar stock
    const detalle = await Promise.all(
      productos.map(async (item) => {
        const producto = await Producto.findById(item.productoId);

        if (!producto) {
          throw new Error(`Producto con ID ${item.productoId} no encontrado`);
        }

        const subtotal = item.cantidad * producto.price;

        // ✅ Actualizar stock
        producto.stockAmount += item.cantidad;

        // Si el stock estaba agotado, marcar como disponible
        if (producto.stock === "Agotado" && producto.stockAmount > 0) {
          producto.stock = "Disponible";
        }

        await producto.save();

        return {
          productoId: producto._id,
          nombre: producto.name,
          cantidad: item.cantidad,
          precioUnitario: producto.price,
          subtotal,
        };
      })
    );

    const total = detalle.reduce((acc, prod) => acc + prod.subtotal, 0);

    const notaCredito = new NotaCredito({
      clienteId,
      productos: detalle,
      total,
      motivo,
      observaciones,
      procesadoPor,
    });

    await notaCredito.save();

    res.status(201).json({ message: "Nota de crédito creada correctamente", notaCredito });
  } catch (error) {
    console.error("Error al crear nota de crédito:", error);
    res.status(500).json({ message: "Error al crear la nota de crédito", error: error.message });
  }
};
