import User from "../models/user.model.js";
import Pregunta from "../models/question.model.js"; 
import Roles from "../models/roles.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, password2, username, name,apellidoP,telefono, pregunta,respuesta, imagen,} = req.body;

  // Aquí hace las consultas para evitar duplicación
  const emailFound = await User.findOne({ email });
  const userFound = await User.findOne({ username });
  const telFound = await User.findOne({ telefono });

  if (userFound) return res .status(400).json(["El nombre de usuario ingresado ya está en uso. Por favor, elige otro", ]);
  if (emailFound) return res.status(400).json(["El correo ingresado ya está en uso. Por favor, elige otro"]);
  if (telFound) return res .status(400).json(["El número de teléfono ingresado ya está en uso. Por favor, elige otro", ]);
  if (password != password2)return res .status(400).json(["Las contraseñas no son iguales. Intenta nuevamente"]);

  try {
    const passwordHash = await bcrypt.hash(password, 10); // Aquí se encripta la contraseña
    let rol = "Usuario";

    // Aquí se crea el usuario con el campo recuperacion_contrasena
    const newUser = new User({username, name,apellidoP, telefono, email,imagen, password: passwordHash, rol,
      recuperacion_contrasena: [
        {
          pregunta,
          respuesta,
        },
      ],
    });

    const userSaved = await newUser.save();

    res.json({
      _id: userSaved._id,
      username: userSaved.username,
      name: userSaved.name,
      apellidoP: userSaved.apellidoP,
      telefono: userSaved.telefono,
      email: userSaved.email,
      imagen: userSaved.imagen,
      rol: userSaved.rol,
      recuperacion_contrasena: userSaved.recuperacion_contrasena, // Incluye el campo en la respuesta
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//ruta para poder usar el login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await User.findOne({ username });

    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // se guarda el username y rol en el token
    const tokenPayload = {
      id: userFound._id,
      username: userFound.username,
      name: userFound.name,
      telefono: userFound.telefono,
      email: userFound.email,
      imagen: userFound.imagen,
      apellidoP: userFound.apellidoP,
      rol: userFound.rol,
    };

    const token = await createAccessToken(tokenPayload);

    res.cookie("token", token);

    res.json({
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      rol: userFound.rol,
      imagen: userFound.imagen,
      name: userFound.name,
      telefono: userFound.telefono,
      apellidoP: userFound.apellidoP,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  //en esta funcion se pueden extender mas consultas como datos de sesion
  const userFound = await User.findById(req.user.id);

  if (!userFound)
    return res.status(400).json({ messagge: "usuario no encontrado" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    name: userFound.name,
    imagen: userFound.imagen,
    apellidoP: userFound.apellidoP,
    telefono: userFound.telefono,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const verifyToken = async (req, res) => {
  //en esta funcion se pueden extender mas consultas como datos de sesion
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ messagge: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ messagge: "No autorizado" });

    const userFound = await User.findById(user.id);

    if (!userFound) return res.status(400).json({ messagge: "No autorizado" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email, //aqui es donde se pueden traer los roles para los diferentes niveles de acceso en la aplicacion
      name: userFound.name,
      telefono: userFound.telefono,
      imagen: userFound.imagen,
      apellidoP: userFound.apellidoP,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  });
};

export const createUser = async (req, res) => {
  const { email, password, password2, username, name,apellidoP, telefono, pregunta, rol,respuesta,imagen } = req.body;

  // Aquí hace las consultas para evitar duplicación
  const emailFound = await User.findOne({ email });
  const userFound = await User.findOne({ username });
  const telFound = await User.findOne({ telefono });

  if (userFound) return res .status(400) .json(["El nombre de usuario ingresado ya está en uso. Por favor, elige otro", ]);
  if (emailFound)return res .status(400).json(["El correo ingresado ya está en uso. Por favor, elige otro"]);
  if (telFound) return res  .status(400) .json(["El número de teléfono ingresado ya está en uso. Por favor, elige otro", ]);
  if (password != password2) return res.status(400) .json(["Las contraseñas no son iguales. Intenta nuevamente"]);

  try {
    const passwordHash = await bcrypt.hash(password, 10); // Aquí se encripta la contraseña

    // Aquí se crea el usuario con el campo recuperacion_contrasena
    const newUser = new User({username, name,apellidoP, telefono, email,imagen, password: passwordHash, rol,
        recuperacion_contrasena: [
          {
            pregunta,
            respuesta,
          },
        ],
      });

    const userSaved = await newUser.save();

    res.json({
        _id: userSaved._id,
        username: userSaved.username,
        name: userSaved.name,
        apellidoP: userSaved.apellidoP,
        telefono: userSaved.telefono,
        email: userSaved.email,
        imagen: userSaved.imagen,
        rol: userSaved.rol,
        recuperacion_contrasena: userSaved.recuperacion_contrasena, // Incluye el campo en la respuesta
        createdAt: userSaved.createdAt,
        updatedAt: userSaved.updatedAt,
      });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: error.message });
    return res.status(500).json(["Ocurrio un error al registar el usuario"]);
  }
};

export const findUser = async (req, res) => {
  try {
    const { username} = req.body;

    // Buscar usuario
    const dataFound = await User.findOne({ username });

    if (!dataFound) {
      return res.status(400).json(["Usted no se encuentra registrado. Intente de nuevo 1"]);
    } else {
      console.log("datos de consulta findUse"+dataFound);
      return res.json(dataFound);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(["Ocurrió un error al consultar el usuario"]);
  }
};

// consultapara las preguntas
export const findUserQuestion = async (req, res) => {
  try {
    console.log("ID recibido en backend:", req.params.id);
    const findQuestion = await User.findById(req.params.id);
    console.log("Resultado de la consulta:", findQuestion);

    if (!findQuestion) {
      return res.status(400).json(["Usted no se encuentra registrado. Intente de nuevo PREGUNTA"]);
    } else {
      return res.json(findQuestion);
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json(["Ocurrió un error al consultar el usuario"]);
  }
};

export const updateUser = async (req, res) => {
    try {
        const { username, name, apellidoP, telefono, email, rol, pregunta, respuesta, imagen } = req.body;
        const userId = req.params.id; // Obtener el ID del usuario a actualizar

        // Aquí hace las consultas para evitar duplicación
        const userFound = await User.findOne({ username });
        const emailFound = await User.findOne({ email });
        const telFound = await User.findOne({ telefono });

        // Verificar si el nombre de usuario ya está en uso por otro usuario
        if (userFound && userFound._id.toString() !== userId) {
            return res.status(400).json([`El nombre de usuario "${username}" ya está en uso. Por favor, elige otro.`]);
        }

        // Verificar si el correo ya está en uso por otro usuario
        if (emailFound && emailFound._id.toString() !== userId) {
            return res.status(400).json(["El correo ingresado ya está en uso. Por favor, elige otro"]);
        }

        // Verificar si el teléfono ya está en uso por otro usuario
        if (telFound && telFound._id.toString() !== userId) {
            return res.status(400).json(["El número de teléfono ingresado ya está en uso. Por favor, elige otro"]);
        }

        // Verificar que el usuario exista antes de actualizar
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar los datos generales del usuario
        user.username = username || user.username;
        user.name = name || user.name;
        user.apellidoP = apellidoP || user.apellidoP;
        user.imagen = imagen || user.imagen;
        user.telefono = telefono || user.telefono;
        user.email = email || user.email;
        user.rol = rol || user.rol;

        // Actualizar pregunta y respuesta secreta si se proporcionan
        if (pregunta && respuesta) {
            if (user.recuperacion_contrasena.length > 0) {
                user.recuperacion_contrasena[0].pregunta = pregunta;
                user.recuperacion_contrasena[0].respuesta = respuesta;
            } else {
                user.recuperacion_contrasena.push({ pregunta, respuesta });
            }
        }

        // Guardar los cambios
        await user.save();

        res.json({
            message: "Usuario actualizado correctamente",
            user,
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};  

export const questions = async (req, res) => {
  try {
    const preguntasFound = await Pregunta.find(); //aqui consulta las preguntas
    res.json(preguntasFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const roles = async (req, res) => {
  try {
    const rolesFound = await Roles.find(); //aqui consulta las preguntas
    res.json(rolesFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los usuarios de la base de datos
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los usuarios" });
  }
};

// Para traer un solo usuario para actualizacion de sus datos
export const getUser = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al obtener el usuario" });
  }
};

// pa elimiar usuarios
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(204).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al eliminar el usuario" });
  }
};