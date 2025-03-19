import mongoose from 'mongoose';

// Definimos los subdocumentos para las políticas
const PrivacyPolicySchema = new mongoose.Schema({
    privacidad: { type: String, required: true },
    descripcion: { type: String, required: true },
});

const CookiePolicySchema = new mongoose.Schema({
    cookies: { type: String, required: true },
    descripcion: { type: String, required: true },
});

const SecurityPolicySchema = new mongoose.Schema({
    seguridad: { type: String, required: true },
    descripcion: { type: String, required: true },
});

const CustomerServicePolicySchema = new mongoose.Schema({
    atencion_al_cliente: { type: String, required: true },
    descripcion: { type: String, required: true },
});

const AccessibilityPolicySchema = new mongoose.Schema({
    accesibilidad: { type: String, required: true },
    descripcion: { type: String, required: true },
});

const SocialResponsibilityPolicySchema = new mongoose.Schema({
    responsabilidad_social: { type: String, required: true },
    descripcion: { type: String, required: true },
});

// Definimos el esquema principal de la empresa
const CompanySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        default: "Huellitas Shop",
    },
    acerca_de: {
        type: String,
        required: false,
        default: "Somos una empresa que vende productos para mascotas",
    },
    mision: {
        type: String,
        required: true,
        default: "Esta es la misión",
    },
    vision: {
        type: String,
        required: true,
        default: "Esta es la visión de la empresa",
    },
    telefono: {
        type: Number,
        required: true,
        default: 7712315167,
    },
    correo: {
        type: String,
        required: true,
        default: "huellitasShopMexico@gmail.com",
    },
    // Cambiamos el campo ubicacion para que incluya código postal, estado y colonia
    ubicacion: [
        {
            calle: { type: String, required: true, default: "awf" },
            ciudad: { type: String, required: true, default: "Ciudad" },
            codigo_postal: { type: String, required: true, default: "00000" }, // Campo de código postal
            estado: { type: String, required: true, default: "Estado" }, // Campo de estado
            colonia: { type: String, required: true, default: "Colonia" }, // Campo de colonia
        },
    ],
    // Agregamos las redes sociales
    redes_sociales: {
        facebook: { type: String, required: false },
        twitter: { type: String, required: false },
        instagram: { type: String, required: false },
    },
    politicas: {
        privacidad: [PrivacyPolicySchema],
        cookies: [CookiePolicySchema],
        seguridad: [SecurityPolicySchema],
        atencion_al_cliente: [CustomerServicePolicySchema],
        accesibilidad: [AccessibilityPolicySchema],
        responsabilidad_social: [SocialResponsibilityPolicySchema],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Exportamos el modelo de la empresa
export default mongoose.model('Empresa', CompanySchema);
