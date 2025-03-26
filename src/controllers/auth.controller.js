import User from "../models/user.model.js";
import Pregunta from "../models/question.model.js";
import Roles from "../models/roles.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import crypto from "crypto"; // Importa crypto para generar tokens
import nodemailer from "nodemailer"; // Importa nodemailer

export const register = async (req, res) => {
  const {
    email,
    password,
    password2,
    username,
    name,
    apellidoP,
    telefono,
    pregunta,
    respuesta,
    imagen,
  } = req.body;

  // Aquí hace las consultas para evitar duplicación
  const emailFound = await User.findOne({ email });
  const userFound = await User.findOne({ username });
  const telFound = await User.findOne({ telefono });

  if (userFound)
    return res
      .status(400)
      .json([
        "El nombre de usuario ingresado ya está en uso. Por favor, elige otro",
      ]);
  if (emailFound)
    return res
      .status(400)
      .json(["El correo ingresado ya está en uso. Por favor, elige otro"]);
  if (telFound)
    return res
      .status(400)
      .json([
        "El número de teléfono ingresado ya está en uso. Por favor, elige otro",
      ]);
  if (password != password2)
    return res
      .status(400)
      .json(["Las contraseñas no son iguales. Intenta nuevamente"]);

  try {
    const passwordHash = await bcrypt.hash(password, 10); // Aquí se encripta la contraseña
    let rol = "Usuario";
    let token = "";
    const tokenExpire = Date.now() + 3600000;

    // Aquí se crea el usuario con el campo recuperacion_contrasena
    const newUser = new User({
      username,
      name,
      apellidoP,
      telefono,
      email,
      imagen,
      password: passwordHash,
      rol,
      token,
      tokenExpire,
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
      token: userSaved.token,
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

    res.cookie("token", token, {
      httpOnly: true,
    });

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
  const {
    email,
    password,
    password2,
    username,
    name,
    apellidoP,
    telefono,
    pregunta,
    rol,
    respuesta,
    imagen,
  } = req.body;

  // Aquí hace las consultas para evitar duplicación
  const emailFound = await User.findOne({ email });
  const userFound = await User.findOne({ username });
  const telFound = await User.findOne({ telefono });

  if (userFound)
    return res
      .status(400)
      .json([
        "El nombre de usuario ingresado ya está en uso. Por favor, elige otro",
      ]);
  if (emailFound)
    return res
      .status(400)
      .json(["El correo ingresado ya está en uso. Por favor, elige otro"]);
  if (telFound)
    return res
      .status(400)
      .json([
        "El número de teléfono ingresado ya está en uso. Por favor, elige otro",
      ]);
  if (password != password2)
    return res
      .status(400)
      .json(["Las contraseñas no son iguales. Intenta nuevamente"]);

  try {
    const passwordHash = await bcrypt.hash(password, 10); // Aquí se encripta la contraseña
    let token = "";
    const tokenExpire = Date.now() + 3600000;

    // Aquí se crea el usuario con el campo recuperacion_contrasena
    const newUser = new User({
      username,
      name,
      apellidoP,
      telefono,
      email,
      imagen,
      password: passwordHash,
      rol,
      token,
      tokenExpire,
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
      token: userSaved.token,
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
    const { username } = req.body;

    // Buscar usuario
    const dataFound = await User.findOne({ username });

    if (!dataFound) {
      return res
        .status(400)
        .json(["Usted no se encuentra registrado. Intente de nuevo 1"]);
    } else {
      console.log("datos de consulta findUse" + dataFound);
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
      return res
        .status(400)
        .json(["Usted no se encuentra registrado. Intente de nuevo PREGUNTA"]);
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
    const {
      username,
      name,
      apellidoP,
      telefono,
      email,
      rol,
      pregunta,
      respuesta,
      imagen,
    } = req.body;
    const userId = req.params.id; // Obtener el ID del usuario a actualizar

    // Aquí hace las consultas para evitar duplicación
    const userFound = await User.findOne({ username });
    const emailFound = await User.findOne({ email });
    const telFound = await User.findOne({ telefono });

    // Verificar si el nombre de usuario ya está en uso por otro usuario
    if (userFound && userFound._id.toString() !== userId) {
      return res
        .status(400)
        .json([
          `El nombre de usuario "${username}" ya está en uso. Por favor, elige otro.`,
        ]);
    }

    // Verificar si el correo ya está en uso por otro usuario
    if (emailFound && emailFound._id.toString() !== userId) {
      return res
        .status(400)
        .json(["El correo ingresado ya está en uso. Por favor, elige otro"]);
    }

    // Verificar si el teléfono ya está en uso por otro usuario
    if (telFound && telFound._id.toString() !== userId) {
      return res
        .status(400)
        .json([
          "El número de teléfono ingresado ya está en uso. Por favor, elige otro",
        ]);
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
export const sendEmail = async (email, username) => {
  //console.log("Datos recibidos:", email, username); // Verifica los datos
  try {
    const token = crypto.randomBytes(16).toString("hex");

    // Buscar al usuario
    const userFound = await User.findOne({ username: username });
    if (!userFound) {
      console.error("Usuario no encontrado");
      return false;
    }

    // Actualizar el token en la base de datos
    userFound.token = token;
    userFound.tokenExpire = Date.now() + 3600000; // Expira en 1 hora
    await userFound.save();

    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alexishernandezgt05@gmail.com",
        pass: "vxxj ddpj hvxu ofbs",
      },
    });

    // Configurar el contenido del correo
    const mailOptions = {
      from: "alexishernandezgt05@gmail.com",
      to: email,
      subject: "Recuperación de Contraseña",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                padding: 20px;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
              }
              .content {
                margin: 20px 0;
                line-height: 1.6;
              }
              .token {
                text-align: center;
                font-size: 20px;
                color: red;
              }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin-top: 20px;
              font-weight: bold;
              text-align: center; /* Asegura que el texto dentro del botón esté centrado */
              display: block; /* Cambiado a block para permitir el centrado */
              width: fit-content; /* Ajusta el ancho del botón según su contenido */
              margin-left: auto;
              margin-right: auto; /* Esto centra el botón */
            }

              .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="header">Recuperación de Contraseña</h2>
              <p class="content">Hola ${username},</p>
              <p class="content">
                Tu respuesta secreta fue verificada correctamente. Para restablecer tu contraseña, 
                haz clic en el siguiente enlace:
              </p>
              <p class="content">
                <a href="http://localhost:5173/token/${username}" class="button">Restablecer Contraseña</a>
              </p>
              <p class="content">También puedes usar este token en el siguiente campo para restablecer tu contraseña:</p>
              <pre class="token">${token}</pre>
              <p class="content">
                Este token expirará en 1 hora.
              </p>
              <div class="footer">
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");
    return true;
  } catch (error) {
    console.error("Error enviando correo:", error);
    return false;
  }
};

export const verifyTokenUser = async (req, res) => {
  try {
    const { username, token } = req.body;

    // Verificar que los parámetros necesarios estén presentes
    if (!username || !token) {
      return res
        .status(400)
        .json({ message: "Faltan parámetros requeridos (username o token)" });
    }

    // Buscar al usuario por su nombre de usuario
    const user = await User.findOne({ username });
    //console.log(user);

    // Si no se encuentra el usuario o el token no coincide o ha expirado
    if (!user || user.token !== token || user.tokenExpire < Date.now()) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Si todo está bien, el token es válido, se devuelve el usuario completo
    return res.json(user);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(500).json({ message: "Error al verificar el token" });
  }
};

export const resetPassword = async (req, res) => {
  const { password, password2, username } = req.body;

  // Verifica si el nombre de usuario existe en la base de datos
  const userFound = await User.findOne({ username });

  if (!userFound)
    return res.status(400).json(["El nombre de usuario no está registrado"]);

  // Verifica que ambas contraseñas coincidan
  if (password !== password2){
    console.log("las con no son iguales");
    return res.status(400).json(["Las contraseñas no son iguales. Intenta nuevamente"]);
  }

  // Valida la fortaleza de la contraseña (opcional)
  if (password.length < 8) {
    return res.status(400).json(["La contraseña debe tener al menos 8 caracteres"]);
  }

  try {
    // Encriptamos la nueva contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Actualizamos la contraseña en el usuario
    userFound.password = passwordHash;

    // Guardamos los cambios en la base de datos
    await userFound.save();

    res.json({
      message: "Contraseña actualizada correctamente",
      userFound: {
        username: userFound.username,
        // No es recomendable enviar la contraseña o datos sensibles
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
};

