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

export const loginSchema = z.object({
  email: eduMxEmail,
  password: z.string().min(1, 'La contrasena es obligatoria.'),
  role: z.enum(ROLE_VALUES, { message: 'El rol debe ser STUDENT o DRIVER.' }),
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').optional(),
  lastNamePaternal: z.string().trim().min(2, 'El apellido paterno debe tener al menos 2 caracteres.').optional(),
  lastNameMaternal: z.string().trim().optional(),
  phone: z.string().trim().min(10, 'El telefono debe tener al menos 10 caracteres.').optional(),
  photoUrl: z.string().url('URL de foto invalida.').optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Correo invalido.'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'El token es obligatorio.'),
  newPassword: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
