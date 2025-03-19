import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {getProduct, getProducts, deleteProduct, updateProduct, createProduct, getMarcas, getCategorias} from "../controllers/product.controller.js"
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createProductSchema } from "../schemas/product.schema.js";

const router = Router();

//estas son rutas protegidas para que solo usuarios que tengan sesion puedan entrar
//para consultar todas las tareas
router.get("/product", getProducts)

router.get("/products", authRequired, getProducts)

router.get("/view-details/:id", getProduct)

//para traer prodcuto 1 se espera un :id OK
router.get("/add-product/:id", authRequired, getProduct)

//para crear productos, verificar usuario aun 
router.post("/producto",validateSchema(createProductSchema) , createProduct)

//para eliminar producto se espera un :id
router.delete("/products/:id", authRequired, deleteProduct)

//para actualizar una tarea se espera un :id OKEYYYY
router.put("/products/:id", authRequired, updateProduct)

//para obteenr las marcas y categorias
router.get('/marcas', getMarcas); // Ruta para obtener las marcas
router.get('/categorias', getCategorias); // Ruta para obtener las categorias

export default router