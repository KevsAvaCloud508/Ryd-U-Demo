import { z } from 'zod';

export const createRatingSchema = z.object({
  tripId: z.string().uuid('Viaje inválido.'),
  rateeId: z.string().uuid('Usuario inválido.'),
  score: z.coerce.number().int().min(1, 'La puntuación mínima es 1.').max(5, 'La puntuación máxima es 5.'),
});

export type CreateRatingInput = z.infer<typeof createRatingSchema>;
