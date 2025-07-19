import multer from "multer";

const storage = multer.memoryStorage(); // Guardamos en memoria para leer directamente
const upload = multer({ storage });

export default upload;
