import { Router } from "express";
import {createDevice, getInfoDevice, updateUserIdInDevice, getDeviceHistory,getUsersWithIoTDevices, getDevicesByUser, datosRecibidos} from "../controllers/device.controller.js"

const router = Router();

//estas son rutas protegidas para que solo usuarios que tengan sesion puedan entrar
//para consultar todas las tareas
router.post("/addDevice", createDevice)
router.get('/device/:id', getInfoDevice); // Ruta para obtener un dispositivo por su ID
router.put('/device/:id', updateUserIdInDevice); // Ruta para obtener un dispositivo por su ID
// Ruta para obtener los dispositivos de un usuario, cambiamos 'id' por 'id_usuario'
router.get('/devices/:id_usuario', getDevicesByUser); 

router.get('/devices', getUsersWithIoTDevices); 

router.post("/datosRecibidos/", datosRecibidos)

router.get("/historial/:mac", getDeviceHistory);


export default router;
