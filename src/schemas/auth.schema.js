import {z} from 'zod'

export const registerSchema = z.object({
    username: z.string({
        required_error: 'Llena el campo de usuario'
    }).max(20, { message: 'El máximo es de 18 caracteres para el nombre de usuario' }).min(3, { message: 'El mínimo es 8 caracteres para el nombre de usuario' }), // Falta el regex
    name: z.string({
        required_error: 'Llena el campo de usuario'
    }).max(20, { message: 'El máximo es de 18 caracteres para el nombre' }).min(3, { message: 'El mínimo es 8 caracteres para el nombre' }), // Falta el regex
    apellidoP: z.string({
        required_error: 'Llena el campo de usuario'
    }).max(20, { message: 'El máximo es de 18 caracteres para el apellido' }).min(3, { message: 'El mínimo es 8 caracteres para el apellido' }), // Falta el regex
    telefono: z.string({
        required_error: 'Llena el campo de usuario'
    }).max(10, { message: 'El máximo es de 10 caracteres para el número de teléfono' }).min(9, { message: 'El mínimo es 8 caracteres para el número de teléfono' }), // Falta el regex
    email: z.string({
        required_error: 'Llena el campo de correo'
    }).email({
        message: 'Ingresa un correo válido'
    }),
    imagen: z.string({
        required_error: 'Ocurrio un error al guardar la imagen en la base de datos, intenta nuevamente'
    }).max(200, { message: 'El máximo es de 200 caracteres para la imagen' }).min(3, { message: 'Ocurrio un error al guardar la imagen en la base de datos, intenta nuevamente' }), // Falta el regex
    password: z.string({
        required_error: 'Llena el campo de contraseña'
    }).max(18, { message: 'El máximo es de 18 caracteres para la contraseña' }).min(8, { message: 'El mínimo es 8 caracteres para la contraseña' }),
    pregunta: z.string({ 
        required_error: 'Llena el campo de pregunta'
    }),
    respuesta: z.string({ 
        required_error: 'Llena el campo de respuesta'
    })
});


export const loginSchema = z.object({
    username: z.string({
        required_error: 'Llena el campo de usuario'
    }),
    password: z.string({
        required_error: 'Llena el campo de contraseña'
    }).max(18, {message:'El maximo es de 18 caracteres para la contraseña'}).min(8, {message: 'El minimo es 8 caracteres para la contraseña'})
});

//ESTOS SE VAN A VALIDATOS MIDDLEWARE 