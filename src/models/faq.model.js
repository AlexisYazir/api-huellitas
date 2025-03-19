import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    pregunta: {
        type: String,
        required: true,
    },
    respuesta: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Faq', faqSchema);