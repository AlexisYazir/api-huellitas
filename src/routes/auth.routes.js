import {Router} from "express";
import {login, register, logout, profile, verifyToken, questions, findUserQuestion,findUser,createUser,updateUser, roles, getUsers, deleteUser, getUser } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema,loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post('/register',validateSchema(registerSchema), register);

//pa crear un usuario por administrador
router.post('/createUser',validateSchema(registerSchema), createUser);

//para eliminar una usuarios se espera un :id
router.delete("/user/:id", authRequired, deleteUser);

//para traer los datos del usuario para actualizacion
//router.get("/view-details/:id", getProduct)
router.get("/add-users/:id", getUser);

router.post('/login',validateSchema(loginSchema) ,login);

router.post('/logout', logout);

router.get('/verify', verifyToken );

router.get('/profile', authRequired, profile);

router.get('/questions', questions); // Ruta para obtener las preguntas

router.get('/roles', roles);

router.get('/users', authRequired, getUsers) //juever por la madrugada puse el authRequired

//para actualizar una tarea se espera un :id OKEYYYY
router.put("/users/:id", authRequired, updateUser)

router.post("/find-user", findUser);

router.post("/find-user/:id", findUserQuestion)

export default router;