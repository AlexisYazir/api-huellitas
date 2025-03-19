import mongoose from 'mongoose';

const rolesSchema = new mongoose.Schema({
    nombre_rol: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Roles', rolesSchema);