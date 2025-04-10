import User from "../../models/userModel/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registro = async (req, res) => {
  const { user, password } = req.body;

  try {
    const nuevoUsuario = await User.create({ user, password });

    return res.status(201).json({ message: "Usuario registrado", usuario: nuevoUsuario });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

  
export const login = async (req, res) => {
  console.log(req.body);
  const { user, password } = req.body;

  try {
    const usuario = await User.findOne({ user });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, user: usuario.user },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error });
  }
};


 export const logout = (req, res) => {
    try {
      // Si usas sesiones en el servidor
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
          }
          res.clearCookie("connect.sid"); // Limpia la cookie de sesión si estás usando express-session
          return res.status(200).json({ message: "Sesión cerrada correctamente" });
        });
      } else {
        // Si usas JWT, simplemente envías una respuesta sin modificar el token en el cliente
        return res.status(200).json({ message: "Cierre de sesión exitoso" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
  };