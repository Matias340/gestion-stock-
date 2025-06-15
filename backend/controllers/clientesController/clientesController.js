import Cliente from "../../models/clientesModel/clientesModel.js";

export const createCliente = async (req, res) => {
  const { nombre, telefono, email, observaciones } = req.body;

  try {
    const existeCliente = await Cliente.findOne({ where: { nombre } });

    if (existeCliente) {
      return res.status(400).json({ msg: "Cliente ya registrado" });
    }
    const cliente = await Cliente.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Cliente registrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const getCliente = async (req, res) => {
  try {
    const clientes = await Cliente.find({ userId: req.userId }).select("_id nombre, telefono, email, observaciones");
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error en getCliente:", error);
    res.status(500).json({ message: "Error al obtener los Clientes", error });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const Cliente = await Cliente.findById({ _id: req.params.id, userId: req.userId });
    if (!Cliente) return res.status(404).json({ message: "cliente no encontrado" });
    res.status(200).json(Cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los Cliente", error });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const updatedCliente = await Cliente.findByIdAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, {
      new: true,
    });
    if (!updatedCliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json(Cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el Cliente", error });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    const deletedCliente = await Cliente.findByIdAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedCliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json({ message: "Cliente eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el Cliente", error });
  }
};
