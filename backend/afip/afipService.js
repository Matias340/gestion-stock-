import axios from "axios";

const AFIP_MICROSERVICE_URL = "http://localhost:5000/afip/facturar"; // Cambiar por la URL real

export const enviarAFIP = async (payloadXML) => {
  try {
    const response = await axios.post(AFIP_MICROSERVICE_URL, { payload: payloadXML });
    return response.data;
  } catch (error) {
    console.error("Error al comunicar con el microservicio AFIP:", error);
    throw new Error(error?.response?.data?.error || "Error al comunicar con AFIP");
  }
};
