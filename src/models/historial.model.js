import mongoose from 'mongoose';

const historialIoTSchema = new mongoose.Schema({
    id_dispositivo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IoTDevice',
        required: true
    },
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
        default: Date.now,
        required: true
    },
    mac: {
        type: String,
        required: true
    },
    horarios: {
        type: [Date], // Array de fechas
        validate: {
            validator: function (v) {
                return v.length === 2; // Asegura que haya exactamente 2 horarios
            },
            message: 'Debe haber exactamente dos horarios programados.'
        },
        required: true
    }
}, {
    timestamps: true 
});

export default mongoose.model('HistorialIoT', historialIoTSchema);
