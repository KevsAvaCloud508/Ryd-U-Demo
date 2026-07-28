import { z } from 'zod';

export const createRouteSchema = z.object({
  origin: z.string().trim().min(2, 'El origen es obligatorio.'),
  destination: z.string().trim().min(2, 'El destino es obligatorio.'),
  description: z.string().trim().optional(),
  distanceKm: z.coerce.number().positive().optional(),
  estimatedMinutes: z.coerce.number().int().positive().optional(),
});

export const updateRouteSchema = createRouteSchema.partial();

export const searchRouteSchema = z.object({
  origin: z.string().trim().optional(),
  destination: z.string().trim().optional(),
  query: z.string().trim().optional(),
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
export type SearchRouteInput = z.infer<typeof searchRouteSchema>;
