import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    categoria: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Categoria', categoriaSchema);