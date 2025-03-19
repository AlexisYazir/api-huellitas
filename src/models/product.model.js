import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    nombre_producto: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0 // Evita valores negativos
    },
    categoria: {
        type: String,
        required: true,
        trim: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0 // Evita valores negativos
    },
    imagenes: {
        type: [String], // Almacena un array de URLs como strings
        required: false, // No es obligatorio
        validate: {
            validator: function (arr) {
                return arr.length >= 1 && arr.length <= 3; // Asegura que haya entre 1 y 3 imágenes
            },
            message: 'Debe proporcionar entre 1 y 3 imágenes'
        }
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model('Product', productSchema);
