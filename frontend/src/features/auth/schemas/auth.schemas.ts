import { z } from 'zod';

const eduMxEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email('Correo invalido.')
  .refine((val) => val.endsWith('.edu.mx'), {
    message: 'Debes usar un correo institucional (.edu.mx).',
  });

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    lastNamePaternal: z.string().trim().min(2, 'El apellido paterno debe tener al menos 2 caracteres.'),
    lastNameMaternal: z.string().trim().optional(),
    email: eduMxEmail,
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
    role: z.enum(['STUDENT', 'DRIVER']),
    acceptsTerms: z.boolean().refine((value) => value === true, {
      message: 'Debes aceptar los Términos y el Aviso de privacidad.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: eduMxEmail,
  password: z.string().min(1, 'La contrasena es obligatoria.'),
  role: z.enum(['STUDENT', 'DRIVER']),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
