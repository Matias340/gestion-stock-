import { enviarAFIP } from "./afipService.js";

export const facturarConAFIP = async (req, res) => {
  try {
    const { payloadXML } = req.body; // El XML lo podés generar desde el frontend o desde Node

    if (!payloadXML) {
      return res.status(400).json({ error: "El campo payloadXML es requerido." });
    }

    const resultado = await enviarAFIP(payloadXML);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
