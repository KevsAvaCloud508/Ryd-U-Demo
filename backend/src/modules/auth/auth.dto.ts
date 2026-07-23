import { z } from 'zod';

// Los roles de negocio se exponen en inglés en la API (STUDENT/DRIVER) y se
// traducen a los nombres reales de la tabla `rol` ('Pasajero'/'Conductor') en el service.
export const ROLE_VALUES = ['STUDENT', 'DRIVER'] as const;
// ADMIN no aparece en ROLE_VALUES a propósito: nadie puede registrarse ni
// pedir ese rol desde la API; solo se asigna por seed/BD (rol 'Administrador').
export type AppRole = (typeof ROLE_VALUES)[number] | 'ADMIN';

// Correo institucional obligatorio: debe ser .edu.mx
const eduMxEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email('Correo invalido.')
  .refine((val) => val.endsWith('.edu.mx'), {
    message: 'Debes usar un correo institucional (.edu.mx).',
  });

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastNamePaternal: z.string().trim().min(2, 'El apellido paterno debe tener al menos 2 caracteres.'),
  lastNameMaternal: z.string().trim().min(2).optional(),
  email: eduMxEmail,
  phone: z.string().trim().min(10).optional(),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.'),
  role: z.enum(ROLE_VALUES, { message: 'El rol debe ser STUDENT o DRIVER.' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
