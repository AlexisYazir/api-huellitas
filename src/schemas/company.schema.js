import { z } from 'zod';

export const CompanySchema = z.object({
    nombre: z.string({
        required_error: 'El campo nombre es obligatorio',
    }),
    acerca_de: z.string().optional(),
    mision: z.string({
        required_error: 'Llena el campo de misión',
    }),
    vision: z.string({
        required_error: 'Llena el campo de visión',
    }),
    telefono: z.number({
        required_error: 'El campo teléfono es obligatorio',
    }),
    correo: z.string().email({
        message: 'Correo no válido',
        required_error: 'El campo correo es obligatorio',
    }),
    ubicacion: z.array(
        z.object({
            calle: z.string({
                required_error: 'El campo calle es obligatorio',
            }),
            ciudad: z.string({
                required_error: 'El campo ciudad es obligatorio',
            }),
            codigo_postal: z.string({
                required_error: 'El campo código postal es obligatorio',
            }),
            estado: z.string({
                required_error: 'El campo estado es obligatorio',
            }),
            colonia: z.string({
                required_error: 'El campo colonia es obligatorio',
            }),
        })
    ),
    redes_sociales: z.object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
    }).optional(),
    politicas: z.object({
        privacidad: z.array(
            z.object({
                privacidad: z.string({
                    required_error: 'El campo privacidad es obligatorio',
                }),
                descripcion: z.string({
                    required_error: 'El campo descripción de privacidad es obligatorio',
                }),
            })
        ),
        cookies: z.array(
            z.object({
                cookies: z.string({
                    required_error: 'El campo cookies es obligatorio',
                }),
                descripcion: z.string({
                    required_error: 'El campo descripción de cookies es obligatorio',
                }),
            })
        ),
        seguridad: z.array(
            z.object({
                seguridad: z.string({
                    required_error: 'El campo seguridad es obligatorio',
                }),
                descripcion: z.string({
                    required_error: 'El campo descripción de seguridad es obligatorio',
                }),
            })
        ),
        atencion_al_cliente: z.array(
            z.object({
                atencion_al_cliente: z.string({
                    required_error: 'El campo atención al cliente es obligatorio',
                }),
                descripcion: z.string({
                    required_error: 'El campo descripción de atención al cliente es obligatorio',
                }),
            })
        ),
        accesibilidad: z.array(
            z.object({
                accesibilidad: z.string({
                    required_error: 'El campo accesibilidad es obligatorio',
                }),
                descripcion: z.string({
                    required_error: 'El campo descripción de accesibilidad es obligatorio',
                }),
            })
        ),
        responsabilidad_social: z.array(
            z.object({
                responsabilidad_social: z.string({
                    required_error: 'El campo responsabilidad social es obligatorio',
                }),
                descripcion: z.string({
                    required_error: 'El campo descripción de responsabilidad social es obligatorio',
                }),
            })
        ),
    }),
    date: z.date().optional(), // Si es un Date real
    // date: z.string().optional() // Si se almacena como string
});
