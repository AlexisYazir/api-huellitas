import IoTDevice from "../models/device.model.js";
import HistorialIoT from "../models/historial.model.js";

export const createDevice = async (req, res) => {
  try {
    const {
      estado_agua,
      estado_comida,
      traste_agua,
      traste_comida,
      bomba,
      servo,
      id_usuario,
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
      !id_usuario ||
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
    const { id } = req.params; // ID del producto desde la URL
    const { id_usuario } = req.body; // Nuevo ID de usuario desde el body

    // Validar que el id_usuario sea válido
    if (!id_usuario || typeof id_usuario !== "string") {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    // Buscar el dispositivo por id_producto
    const device = await IoTDevice.findOne({ id_producto: id });

    if (!device) {
      return res
        .status(404)
        .json({ message: "Dispositivo no encontrado para este producto" });
    }

    // Actualizar el id_usuario
    device.id_usuario = id_usuario;
    await device.save();

    res.json({ message: "ID de usuario actualizado correctamente", device });
  } catch (error) {
    console.error("Error al actualizar el ID de usuario:", error);
    res.status(500).json({ message: "Error al actualizar el ID de usuario" });
  }
};

// Función para obtener todos los dispositivos de un usuario
export const getDevicesByUser = async (req, res) => {
  try {
    const { id_usuario } = req.params; // Obtiene el ID del usuario desde los parámetros de la URL

    // Buscar todos los dispositivos asociados a este usuario y poblar tanto id_usuario como id_producto
    const devices = await IoTDevice.find({ id_usuario })
      .populate("id_usuario", "username") // Obtiene solo el username del usuario
      .populate("id_producto", "nombre_producto"); // Obtiene solo el nombre del producto

    if (devices.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron dispositivos para este usuario" });
    }

    res.json(devices); // Responder con los dispositivos encontrados
  } catch (error) {
    console.error("Error al obtener los dispositivos del usuario:", error);
    res.status(500).json(["Error al obtener los dispositivos del usuario"]);
  }
};
