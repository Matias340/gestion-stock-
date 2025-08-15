import Clientes from "../../models/clientesModel/clientesModel.js";
import Product from "../../models/productoModel/productoModel.js";
import Venta from "../../models/ventaModel/ventaModel.js";

export const ventaCompleta = async (req, res) => {
  try {
    const { products, clientes, total, medioPago, pagoDetalle } = req.body;
    const userId = req.userId;

    // 1️⃣ Validar productos
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No hay productos en la venta" });
    }

    // 2️⃣ Validar medio de pago
    const mediosValidos = ["efectivo", "tarjeta-credito", "tarjeta-debito", "transferencia", "credito", "variado"];
    if (!medioPago || !mediosValidos.includes(medioPago)) {
      return res.status(400).json({ message: "Método de pago inválido" });
    }

    // 3️⃣ Validar pago variado
    if (medioPago === "variado") {
      if (!pagoDetalle || typeof pagoDetalle !== "object") {
        return res.status(400).json({ message: "Falta el desglose de pago (pagoDetalle)" });
      }

      const suma = Object.values(pagoDetalle).reduce((acc, monto) => acc + (monto || 0), 0);
      if (suma !== total) {
        return res.status(400).json({ message: "La suma de pagoDetalle no coincide con el total" });
      }
    }

    // 4️⃣ Validar cliente si se usa crédito
    let clienteId = null;
    if (medioPago === "credito" || (medioPago === "variado" && (pagoDetalle?.credito || 0) > 0)) {
      if (!clientes || !Array.isArray(clientes) || clientes.length === 0) {
        return res.status(400).json({ message: "Falta el cliente para pago con crédito" });
      }
      clienteId = clientes[0].clienteId;
    }

    // 5️⃣ Verificar y actualizar stock de productos
    for (const item of products) {
      if (!item.productId) {
        return res.status(400).json({ message: `Falta el ID del producto en: ${item.name}` });
      }

      const producto = await Product.findOne({ _id: item.productId, userId });
      if (!producto) {
        return res.status(404).json({ message: `Producto no encontrado o no pertenece al usuario: ${item.productId}` });
      }

      if (producto.stockAmount < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${producto.name}` });
      }

      producto.stockAmount -= item.quantity;
      if (producto.stockAmount === 0) producto.stock = "Agotado";

      await producto.save();
    }

    // 6️⃣ Descontar crédito si corresponde
    if (clienteId) {
      const cliente = await Clientes.findOne({ _id: clienteId, userId });
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado o no pertenece al usuario" });
      }

      let montoADescontar = 0;
      if (medioPago === "credito") {
        montoADescontar = total;
      } else if (medioPago === "variado" && pagoDetalle?.credito) {
        montoADescontar = pagoDetalle.credito;
      }

      if (montoADescontar > 0) {
        cliente.notaCredito = Math.max(0, (cliente.notaCredito || 0) - montoADescontar);
        await cliente.save();
      }
    }

    // 7️⃣ Crear la venta
    const nuevaVenta = new Venta({
      products,
      clientes,
      total,
      medioPago,
      pagoDetalle: medioPago === "variado" ? pagoDetalle : undefined, // el modelo se encargará de transformarlo a detalleVariado
      userId,
    });

    await nuevaVenta.save();

    res.status(201).json({ message: "Venta registrada con éxito", venta: nuevaVenta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar la venta" });
  }
};

export const marcarComoCobrada = async (req, res) => {
  try {
    const userId = req.userId;
    const ventaId = req.params.id;

    const venta = await Venta.findOne({ _id: ventaId, userId });

    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada o no pertenece al usuario" });
    }

    if (venta.estado === "cobrado") {
      return res.status(400).json({ message: "La venta ya está cobrada" });
    }

    venta.estado = "cobrado";
    venta.fechaCobro = new Date();

    await venta.save();

    res.status(200).json({ message: "Venta marcada como cobrada", venta });
  } catch (error) {
    console.error("Error al actualizar el estado de la venta:", error);
    res.status(500).json({ message: "Error al actualizar la venta" });
  }
};

export const getSales = async (req, res) => {
  try {
    const userId = req.userId;
    const { estado, fechaDesde, fechaHasta } = req.query;

    const filtro = { userId };

    // Filtrar por estado si está definido
    if (estado && ["pendiente", "cobrado"].includes(estado)) {
      filtro.estado = estado;
    }

    // Filtrar por rango de fechas (basado en createdAt)
    if (fechaDesde || fechaHasta) {
      filtro.createdAt = {};

      if (fechaDesde) {
        filtro.createdAt.$gte = new Date(fechaDesde + "T00:00:00");
      }

      if (fechaHasta) {
        filtro.createdAt.$lte = new Date(fechaHasta + "T23:59:59");
      }
    }

    const sales = await Venta.find(filtro)
      .populate("products.productId") // poblamos productos
      .populate("clientes.clienteId", "nombre apellido codigo email notaCredito") // poblamos cliente completo
      .exec();

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error en getSales:", error);
    res.status(500).json({ message: "Error al obtener las ventas", error });
  }
};

export const deleteSales = async (req, res) => {
  try {
    const userId = req.userId; // Obtener el userId desde el request
    const saleId = req.params.id;

    const deletedSale = await Venta.findOneAndDelete({ _id: saleId, userId });

    if (!deletedSale) {
      return res.status(404).json({ message: "Venta no encontrada o no pertenece al usuario" });
    }

    res.status(200).json({ message: "Venta eliminada con éxito" });
  } catch (error) {
    console.error("Error en deleteSales:", error);
    res.status(500).json({ message: "Error al eliminar la venta", error });
  }
};
