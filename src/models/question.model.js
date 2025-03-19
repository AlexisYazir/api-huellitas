import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    pregunta: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Pregunta', questionSchema);