import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config(); 

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Conectado a MongoDB Atlas");
//     } catch (error) {
//         console.error("Error en la conexión a MongoDB:", error);
//         process.exit(1);
//     }
// };

//PARA CONEXION EN LOCAL SJDJFBOAVMW SDFGB
export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost/merndb");
        console.log("db success");
    } catch (error) {
        console.log(error);
    }
}