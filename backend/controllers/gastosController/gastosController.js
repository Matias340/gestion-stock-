import Gasto from '../../models/gastosModel/gastosModel.js'

export const createGasto = async (req, res) => {
  try {
    const { description, monto } = req.body;

    if (!description || !monto) {
      return res.status(400).json({ msg: "Descripción y monto son obligatorios" });
    }

    const gasto = await Gasto.create({ description, monto });

    res.status(201).json({ msg: "Gasto registrado", gasto });
  } catch (error) {
    console.error("Error al registrar gasto:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const getGastos = async (req, res) => {
    try {
        const gastos = await Gasto.find().select("_id description monto createdAt");
        res.status(200).json(gastos);
    } catch (error) {
        console.error("Error en getGastos:", error);
        res.status(500).json({ message: "Error al obtener los gastos", error });
    }
};

export const getGastoById = async (req, res) => {
  try {
      const gastos = await Gasto.findById(req.params.id);
      if (!gastos) return res.status(404).json({ message: 'Gasto no encontrado' });
      res.status(200).json(gastos);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los gastos', error });
  }
};


export const updateGastos = async (req, res) => {
  try {
      const updatedGastos = await Gasto.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedGastos) return res.status(404).json({ message: 'Gasto no encontrado' });
      res.status(200).json(Gasto);
  } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el gasto', error });
  }
};

export const deleteGastos = async (req, res) => {
  try {
      const deletedGastos = await Gasto.findByIdAndDelete(req.params.id);
      if (!deletedGastos) return res.status(404).json({ message: 'Gasto no encontrado' });
      res.status(200).json({ message: 'Gasto eliminado con éxito' });
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el Gasto', error });
  }
};
