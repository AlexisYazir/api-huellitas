import { z } from 'zod';

export const createProductSchema = z.object({
    nombre_producto: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),

    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder los 500 caracteres'),

    precio: z.preprocess(
        (val) => Number(val), // Convierte el valor a número
        z.number().min(0, 'El precio debe ser un número positivo')
    ),

    categoria: z.string()
        .min(3, 'La categoría debe tener al menos 3 caracteres'),

    marca: z.string()
        .min(2, 'La marca debe tener al menos 2 caracteres'),

    stock: z.preprocess(
        (val) => Number(val), // Convierte el valor a número
        z.number().int('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo')
    ),

    imagenes: z.array(z.string()) // Validación para un array de strings
        .max(3, 'No puede haber más de 3 imágenes') // Si necesitas limitar el número de imágenes
        .optional() // Hacer que sea opcional en caso de que no se envíen imágenes
});
