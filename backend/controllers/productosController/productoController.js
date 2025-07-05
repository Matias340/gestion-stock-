import Product from "../../models/productoModel/productoModel.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, barcode, cost, stock, stockAmount, unit, description } = req.body;

    // Verificar si el producto ya existe
    const existeProducto = await Product.findOne({ barcode }); // estás usando Mongoose, no Sequelize

    if (existeProducto) {
      return res.status(400).json({ msg: "Producto ya registrado" });
    }

    // Validar y limpiar campo 'unit'
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

    let unidadNormalizada = unit?.trim();
    if (unidadNormalizada === "" || !UNIDADES_VALIDAS.includes(unidadNormalizada)) {
      unidadNormalizada = undefined;
    }

    const producto = await Product.create({
      name,
      price,
      barcode,
      cost,
      stock,
      stockAmount,
      unit: unidadNormalizada,
      description,
      userId: req.userId,
    });

    res.status(201).json({ msg: "Producto registrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Obtener todos los productos
export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId }).select(
      "_id name price cost stock stockAmount barcode unit description"
    );
    res.status(200).json(products);
  } catch (error) {
    console.error("Error en getProduct:", error);
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const Product = await Product.findById({ _id: req.params.id, userId: req.userId });
    if (!Product) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(Product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    // Obtenemos el barcode de los parámetros de la URL
    const { barcode } = req.params;

    if (!barcode) {
      return res.status(400).json({ message: "El barcode es requerido." });
    }

    // Buscamos el producto en la base de datos usando el barcode
    const product = await Product.findOne({ barcode, userId: req.userId });

    if (!product) {
      return res.status(404).json({ message: `Producto con barcode ${barcode} no encontrado` });
    }

    // Si el producto existe, lo devolvemos
    res.status(200).json(product);
  } catch (error) {
    console.error("Error al obtener el producto por barcode:", error);
    res.status(500).json({ message: "Error en el servidor al obtener el producto." });
  }
};

// Actualizar un Producto
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, {
      new: true,
    });
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(Product);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el Producto", error });
  }
};
