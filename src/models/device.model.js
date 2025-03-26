import mongoose from 'mongoose';

const iotSchema = new mongoose.Schema({
    estado_agua: {
        type: String,
        required: true,
    },
    estado_comida: {
        type: String,
        required: true,
    },
    traste_agua: {
        type: String,
        required: true,
    },
    traste_comida: {
        type: String,
        required: true,
    },
    bomba: {
        type: String,
        required: true,
    },
    servo: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now, // Establece la fecha y hora actual como valor por defecto
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      
    mac: {
        type: String,
        required: true,
        unique: true, // Asegura que cada dispositivo tenga una dirección MAC única
    },
    nombre: {
        type: String,
        required: false,
    },
    horarios: { // Campo para los horarios programados
        type: [Date], // Es un array de fechas
        required: true,
        validate: {
            validator: function(v) {
                // Aseguramos que se incluyan solo 2 fechas válidas
                return Array.isArray(v) && v.length === 2 && v.every(date => !isNaN(new Date(date)));
            },
            message: 'Los horarios deben ser un array de dos fechas válidas.'
        }
    },
    id_producto: { // Nuevo campo para el ID del producto
        type: mongoose.Schema.Types.ObjectId, // Relacionado con el producto
        ref: 'Product', // Hace referencia al modelo de Producto
        required: true,
    }
}, {
    timestamps: true, // Genera automáticamente los campos createdAt y updatedAt
});

export default mongoose.model('IoTDevice', iotSchema);
