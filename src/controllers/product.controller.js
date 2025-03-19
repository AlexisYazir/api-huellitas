import Product from '../models/product.model.js';
import Marca from '../models/marcas.model.js'
import Categoria from '../models/categorias.model.js'

// Obtener todos los productos de la base de datos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products);
    } catch (error) {
        return res.status(500).json(["Ocurrió un error al obtener los productos" ]);
    }
};

// Obtener un solo producto por ID
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) return res.status(404).json(["Producto no encontrado"]);

        res.json(product);
    } catch (error) {
        return res.status(500).json( ["Ocurrió un error al obtener el producto." ]);
    }
};

// Crear un nuevo producto en la base de datos
export const createProduct = async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, categoria, marca, stock, imagen1, imagen2, imagen3 } = req.body;

        const productFound = await Product.findOne({ nombre_producto });
        console.log(nombre_producto);
        if(productFound) return res.status(400).json(["Ya hay un producto con ese nombre"]);
        if(precio <0) return res.status(500).json(["El precio debe ser un número positivo"]);
        if(stock <0) return res.status(500).json(["El stock debe ser un número positivo"]);

        const imagenes = [imagen1, imagen2, imagen3];

        // Crear el nuevo producto
        const newProduct = new Product({
            nombre_producto,
            descripcion,
            precio,
            categoria,
            marca,
            stock,
            imagenes, // Guardamos las imágenes como array
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message:error.message});
        return res.status(500).json(["Ocurrio un error al guardar el producto. Por favor intente nuevamente"]);
    }
};

// Actualizar un producto por ID
export const updateProduct = async (req, res) => {
    try {
        const { precio, stock, imagen1, imagen2, imagen3 } = req.body;

        // Validaciones
        if (precio <= 0) return res.status(400).json(["El precio debe ser un número positivo"]);
        if (stock <= 0) return res.status(400).json(["El stock debe ser un número positivo"]);

        // Crear un array con las imágenes
        const imagenes = [imagen1, imagen2, imagen3].filter(Boolean); // Filtra valores nulos o undefined

        // Actualizar el producto
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, imagenes }, // Combina el resto del cuerpo con el array de imágenes
            { new: true } // Devuelve el producto actualizado
        );

        if (!product) return res.status(404).json(["Producto no encontrado"]);

        res.json(product);
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).json(["Ocurrió un error al actualizar el producto"]);
    }
};
// Eliminar un producto por ID
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        return res.status(204).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al eliminar el producto" });
    }
};



export const getMarcas = async (req, res) => {
    try {
        const marcasFound = await Marca.find(); //aqui consulta las preguntas
        res.json(marcasFound); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};
export const getCategorias = async (req, res) => {
    try {
        const categoriasFound = await Categoria.find(); //aqui consulta las preguntas
        res.json(categoriasFound); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};