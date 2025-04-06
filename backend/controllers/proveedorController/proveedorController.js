import Proveedor from '../../models/proveedorModel/proveedorModel.js'

export const createProveedor = async (req, res) => {
  const { name, identify, contact, phone, adress, state, description } = req.body;

  try {
    // Verificar si el proveedor ya existe
    const existeProducto = await Proveedor.findOne({ where: { name } });

    if (existeProducto) {
      return res.status(400).json({ msg: "Proveedor ya registrado" });
    }
    const proveedor = await Proveedor.create({
      ...req.body,
    });
    res.status(201).json({ msg: "Proveedor registrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};



// Obtener todos los proveedores
export const getProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.find().select("_id name identify contact phone adress state description");
        res.status(200).json(proveedor);
    } catch (error) {
        console.error("Error en getProveedor:", error);
        res.status(500).json({ message: "Error al obtener los proveedores", error });
    }
};


// Obtener un proveedor por ID
export const getProveedorById = async (req, res) => {
    try {
        const Proveedor = await Proveedor.findById(req.params.id);
        if (!Proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.status(200).json(Product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los Proveedores', error });
    }
};

export const getProveedorByName = async (req, res) => {
    try {
      // Obtenemos el barcode de los parámetros de la URL
      const { name } = req.params;
  
      if (!name) {
        return res.status(400).json({ message: 'El nombre es requerido.' });
      }
  
      const proveedor = await Proveedor.findOne({ name });
  
      if (!proveedor) {
        return res.status(404).json({ message: `Proveedor con nombre ${name} no encontrado` });
      }
      res.status(200).json(proveedor);
    } catch (error) {
      console.error('Error al obtener el proveedor por name:', error);
      res.status(500).json({ message: 'Error en el servidor al obtener el proveedor.' });
    }
  };

// Actualizar un Proveedor
export const updateProveedor = async (req, res) => {
    try {
        const updatedProveedor = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.status(200).json(Proveedor);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el Proveedor', error });
    }
};

// Eliminar un proveedor
export const deleteProveedor = async (req, res) => {
    try {
        const deletedProveedor = await Proveedor.findByIdAndDelete(req.params.id);
        if (!deletedProveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.status(200).json({ message: 'Proveedor eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el Proveedor', error });
    }
};
