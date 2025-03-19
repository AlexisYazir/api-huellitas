import {z} from 'zod'

export const createTaskSchema = z.object({
    title: z.string({
        required_error: 'Llena el campo de titulo'
    }),//falta el regex
    description: z.string({
        required_error: 'Llena el campo para la descripcion'
    }),
    date: z.string().date().optional()
});


//ESTOS SE VAN A IMPORTAR PARA TASKS ROUTES