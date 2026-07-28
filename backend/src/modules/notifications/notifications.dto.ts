import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().uuid('Usuario inválido.'),
  title: z.string().trim().min(1, 'El título es obligatorio.'),
  message: z.string().trim().min(1, 'El mensaje es obligatorio.'),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
