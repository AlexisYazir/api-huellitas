import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    apellidoP: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },    
    imagen: {
        type: String,
        required: false,
        trim: true
    },  
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: false
    },
    recuperacion_contrasena: [
        {
            pregunta: {
                type: String,
                required: true
            },
            respuesta: {
                type: String,
                required: true
            },
            // _id: false // Para que no genere el id del subdocumento
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);