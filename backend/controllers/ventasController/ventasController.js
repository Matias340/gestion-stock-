import Product from '../../models/productoModel/productoModel.js';
import Venta from "../../models/ventaModel/ventaModel.js";

export const ventaCompleta = async (req, res) => {
    try {
        const { products, total } = req.body;

        console.log("Datos recibidos en el backend:", req.body);

        // Validar que los productos sean válidos
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "No hay productos en la venta" });
        }

        // Verificar cada producto en la venta
        for (const item of products) {
            if (!item.productId) {
                return res.status(400).json({ message: `Falta el ID del producto en: ${item.name}` });
            }
            console.log(`Buscando producto con ID: ${item.productId}`);
            const producto = await Product.findById(item.productId);
            console.log("Producto encontrado:", producto);
        
            if (!producto) {
                return res.status(404).json({ message: `Producto no encontrado: ${item.productId}` });
            }
        
            // Verificar stock
            if (producto.stockAmount < item.quantity) {
                return res.status(400).json({ message: `Stock insuficiente para ${producto.name}` });
            }
        
            // Descontar stock
            producto.stockAmount -= item.quantity;
            if (producto.stockAmount === 0) {
                producto.stock = "Agotado";
            }
        
            await producto.save();
        }
        
        // Crear la venta en la base de datos
        const nuevaVenta = new Venta({ products, total });
        await nuevaVenta.save();
        
        // Responder con éxito
        res.status(201).json({ message: "Venta registrada con éxito", venta: nuevaVenta });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al procesar la venta" });
    }
};

export const getSales = async (req, res) => {
    try {
        const Sale = await Venta.find().populate('products.productId') // Hace populate de la referencia 'productId' en el array de productos
        .exec();
        res.status(200).json(Sale);
    } catch (error) {
        console.error("Error en getSales:", error);
        res.status(500).json({ message: "Error al obtener las ventas", error });
    }
};