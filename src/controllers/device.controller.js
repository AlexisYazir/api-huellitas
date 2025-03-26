import IoTDevice from "../models/device.model.js";
import HistorialIoT from "../models/historial.model.js";
import Product from '../models/product.model.js';
export const createDevice = async (req, res) => {
  try {
    const {
      estado_agua,
      estado_comida,
      traste_agua,
      traste_comida,
      bomba,
      servo,
      mac,
      horarios, 
      id_producto, 
    } = req.body;

    // Validamos los valores para evitar errores
    if (
      !estado_agua ||
      !estado_comida ||
      !traste_agua ||
      !traste_comida ||
      !bomba ||
      !servo ||
      !mac ||
      !horarios ||
      !id_producto
    ) {
      return res.status(400).json(["Todos los campos son requeridos"]);
    }

    if (!["ON", "OFF"].includes(bomba) || !["ON", "OFF"].includes(servo)) {
      return res
        .status(400)
        .json([
          "Los valores de 'estado_agua', 'bomba' y 'servo' deben ser 'ON' o 'OFF'",
        ]);
    }

    if (!["LLENO", "MEDIO", "VACIO"].includes(estado_comida)) {
      return res
        .status(400)
        .json(["El estado de la comida debe ser 'LLENO', 'MEDIO' o 'VACIO'"]);
    }

    if (
      !["LLENO", "MEDIO", "VACIO"].includes(traste_agua) ||
      !["LLENO", "MEDIO", "VACIO"].includes(traste_comida)
    ) {
      return res
        .status(400)
        .json(["El estado de los trastes debe ser 'LLENO', 'MEDIO' o 'VACIO'"]);
    }

    if (
      !Array.isArray(horarios) ||
      horarios.length !== 2 ||
      !horarios.every((h) => !isNaN(new Date(h)))
    ) {
      return res
        .status(400)
        .json(["Los horarios deben ser un array con dos fechas válidas"]);
    }

    // Verificamos si el dispositivo IoT con la misma MAC ya existe
    const existingDevice = await IoTDevice.findOne({ mac });
    if (existingDevice) {
      return res
        .status(400)
        .json(["Ya existe un dispositivo con esa dirección MAC"]);
    }
    const nombre ="";
    const id_usuario= "67e23b0eb3011a4026fad9e6";
    // Creamos el nuevo dispositivo IoT
    const newDevice = new IoTDevice({
      estado_agua,
      estado_comida,
      traste_agua,
      traste_comida,
      bomba,
      servo,
      fecha: new Date(),
      id_usuario, // Relacionamos el dispositivo con un usuario
      mac,
      nombre,
      horarios, // Incluimos los horarios
      id_producto, // Incluimos el ID del producto
    });

    // Guardamos el dispositivo en la base de datos
    const savedDevice = await newDevice.save();

    // Creamos un historial con los horarios programados
    const newHistorial = new HistorialIoT({
      id_dispositivo: savedDevice._id,
      estado_agua,
      estado_comida,
      traste_agua,
      traste_comida,
      bomba,
      servo,
      mac,
      horarios, // Incluimos los horarios en el historial
    });

    // Guardamos el historial en la base de datos
    await newHistorial.save();

    // Respondemos con el dispositivo y el historial creado
    res.status(201).json({ device: savedDevice, historial: newHistorial });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json([
        "Ocurrió un error al guardar el dispositivo IoT. Por favor intente nuevamente",
      ]);
  }
};

// Función para obtener un dispositivo IoT y su historial
export const getInfoDevice = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del dispositivo desde la URL

    // Buscar el dispositivo IoT por ID
    const device = await IoTDevice.findById(id);

    if (!device) {
      return res.status(404).json(["Dispositivo no encontrado"]);
    }

    // Crear un historial con los datos actuales del dispositivo
    const newHistorial = new HistorialIoT({
      id_dispositivo: id,
      id_usuario: device.id_usuario._id, // Relacionar con el usuario
      estado_agua: device.estado_agua,
      estado_comida: device.estado_comida,
      traste_agua: device.traste_agua,
      traste_comida: device.traste_comida,
      bomba: device.bomba,
      servo: device.servo,
      mac: device.mac,
      horarios: device.horarios,
    });

    // Guardar el historial en la base de datos
    await newHistorial.save();

    // Responder con los datos del dispositivo
    res.json(device);
  } catch (error) {
    console.error("Error al obtener el dispositivo:", error);
    res
      .status(500)
      .json(["Error al obtener la información del dispositivo IoT"]);
  }
};

export const updateUserIdInDevice = async (req, res) => {
  try {
    const { id } = req.params; 
    const { id_usuario } = req.body; 

    // Validación
    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    // Buscar el dispositivo
    const device = await IoTDevice.findOne({ id_producto: id });

    if (!device) {
      return res.status(404).json({ message: "Dispositivo no encontrado para este producto" });
    }

    // Actualizar el id_usuario en la colección de dispositivos
    device.id_usuario = id_usuario;
    await device.save();

    // Establecer el stock del producto en 0
    const product = await Product.findByIdAndUpdate(
      id, 
      { stock: 0 }, 
      { new: true }
    );

    res.json({
      message: "ID de usuario actualizado correctamente y stock del producto en 0",
      device,
      product
    });
  } catch (error) {
    console.error("Error al actualizar el ID de usuario y el stock:", error);
    res.status(500).json({ message: "Error al actualizar el ID de usuario y el stock" });
  }
};


// Función para obtener todos los dispositivos de un usuario
export const getDevicesByUser = async (req, res) => {
  try {
    const { id_usuario } = req.params; // Obtiene el ID del usuario desde los parámetros de la URL

    // Buscar todos los dispositivos asociados a este usuario y poblar tanto id_usuario como id_producto
    const devices = await IoTDevice.find({ id_usuario })
      .populate("id_usuario", "username") // Obtiene solo el username del usuario
      .populate("id_producto", "nombre_producto") // Obtiene solo el nombre del producto

    if (devices.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron dispositivos para este usuario" });
    }

    res.json(devices);
  } catch (error) {
    console.error("Error al obtener los dispositivos del usuario:", error);
    res.status(500).json(["Error al obtener los dispositivos del usuario"]);
  }
};

export const datosRecibidos = async (req, res) => {
  try {
    const {
      mac,
      servo,
      bomba,
      nivelComida,
      nivelAgua,
      nivelContenedorComida,
      nivelContenedorAgua,
    } = req.body;

    // Validar que la MAC esté presente
    if (!mac) {
      return res.status(400).json({ error: "La dirección MAC es requerida" });
    }

    // Buscar el dispositivo en la base de datos por su MAC
    let device = await IoTDevice.findOne({ mac });

    if (!device) {
      return res.status(404).json({ error: "Dispositivo no encontrado" });
    }

    // Imprimir los datos recibidos en la consola
    console.log("Datos recibidos:", {
      mac,
      servo,
      bomba,
      nivelComida,
      nivelAgua,
      nivelContenedorComida,
      nivelContenedorAgua,
    });

    // Actualizar los valores del dispositivo sin modificar la fecha
    device.servo = servo || device.servo;
    device.bomba = bomba || device.bomba;
    device.estado_comida = nivelContenedorComida || device.estado_comida;
    device.estado_agua = nivelContenedorAgua || device.estado_agua;
    device.traste_comida = nivelComida || device.traste_comida;
    device.traste_agua = nivelAgua || device.traste_agua;

    await device.save();

    res.status(200).json({
      mensaje: "Datos actualizados correctamente",
      datos: device,
    });
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para obtener todos los usuarios con al menos un dispositivo IoT
export const getUsersWithIoTDevices = async (req, res) => {
  try {
    // Buscar todos los dispositivos IoT y poblar la información del usuario y del producto
    const devices = await IoTDevice.find()
      .populate("id_usuario", "username") // Obtiene solo el username del usuario
      .populate("id_producto", "nombre_producto"); // Obtiene solo el nombre del producto

    if (devices.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron usuarios con dispositivos IoT" });
    }

    // Crear un mapa para almacenar usuarios únicos con sus dispositivos
    const usersMap = new Map();

    devices.forEach(device => {
      const user = device.id_usuario;
      if (!usersMap.has(user._id)) {
        usersMap.set(user._id, {
          id_usuario: user._id,
          username: user.username,
          dispositivos: []
        });
      }
      usersMap.get(user._id).dispositivos.push({
        id_dispositivo: device._id,
        nombre_producto: device.id_producto.nombre_producto,
        mac: device.mac // Incluir la dirección MAC del dispositivo
      });
    });

    // Convertir el mapa a un array de usuarios
    const usersWithDevices = Array.from(usersMap.values());

    res.json(usersWithDevices); // Responder con los usuarios y sus dispositivos
  } catch (error) {
    console.error("Error al obtener los usuarios con dispositivos IoT:", error);
    res.status(500).json({ message: "Error al obtener los usuarios con dispositivos IoT" });
  }
};

export const getDeviceHistory = async (req, res) => {
  try {
    const { mac} = req.params;

    // Validamos que el ID sea proporcionado
    if (!mac) {
      return res.status(400).json(["El ID del dispositivo es requerido"]);
    }

    // Buscamos el historial asociado al dispositivo
    const historial = await HistorialIoT.find({ mac }).sort({ fecha: -1 });

    if (!historial.length) {
      return res.status(404).json(["No se encontró historial para este dispositivo"]);
    }

    res.status(200).json(historial);
  } catch (error) {
    console.error(error);
    res.status(500).json(["Error al obtener el historial del dispositivo"]);
  }
};
