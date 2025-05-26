import CierreCaja from "../../models/cierreDeCaja/cierreDeCaja.js";
import Venta from "../../models/ventaModel/ventaModel.js";

// POST: Crear un nuevo cierre de caja
export const crearCierreCaja = async (req, res) => {
  try {
    const { efectivoInicial, ingresosAdicionales = 0, gastos = 0, notas } = req.body;

    const userId = req.userId; // ← Tomamos el ID del token

    // Definimos el rango del día para filtrar las ventas del usuario
    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);
    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    // Traemos todas las ventas del usuario en el día
    const ventasDelDia = await Venta.find({
      createdAt: { $gte: inicioDelDia, $lte: finDelDia },
      userId: userId,
    });

    // Inicializamos totales por método de pago
    let totalesMetodoPago = {
      efectivo: 0,
      tarjeta: 0,
      transferencia: 0,
      variado: 0,
    };

    // Sumamos ventas totales y por método de pago
    let ventasTotales = 0;
    ventasDelDia.forEach((venta) => {
      ventasTotales += venta.total;

      if (venta.medioPago && totalesMetodoPago.hasOwnProperty(venta.medioPago)) {
        totalesMetodoPago[venta.medioPago] += venta.total;
      } else {
        totalesMetodoPago.variado += venta.total;
      }
    });

    // Calculamos efectivoFinal
    const efectivoFinal = efectivoInicial + ventasTotales + ingresosAdicionales - gastos;

    // Creamos el cierre
    const cierre = new CierreCaja({
      efectivoInicial,
      ventasTotales,
      efectivoFinal,
      ingresosAdicionales,
      gastos,
      metodoPago: totalesMetodoPago,
      notas,
      usuario: userId, // Usamos el del token
    });

    await cierre.save();

    res.status(201).json({ message: "Cierre de caja guardado", cierre });
  } catch (error) {
    console.error("Error al crear cierre de caja:", error);
    res.status(500).json({ message: "Error al crear cierre de caja" });
  }
};

export const obtenerCierresCaja = async (req, res) => {
  try {
    const { usuarioId } = req.query;
    const filtro = usuarioId ? { usuario: usuarioId } : {};

    const cierres = await CierreCaja.find(filtro).sort({ fecha: -1 }).populate("usuario", "nombre email");

    res.json(cierres);
  } catch (error) {
    console.error("Error al obtener cierres de caja:", error);
    res.status(500).json({ message: "Error al obtener cierres de caja" });
  }
};

export const eliminarCierreCaja = async (req, res) => {
  try {
    const { id } = req.params;

    const cierre = await CierreCaja.findById(id);
    if (!cierre) {
      return res.status(404).json({ message: "Cierre de caja no encontrado." });
    }

    await cierre.deleteOne();

    res.json({ message: "Cierre de caja eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar cierre de caja:", error);
    res.status(500).json({ message: "Error al eliminar cierre de caja." });
  }
};
