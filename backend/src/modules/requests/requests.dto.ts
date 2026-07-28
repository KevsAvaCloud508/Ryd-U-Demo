import { z } from 'zod';

export const createRequestSchema = z.object({
  tripId: z.string().uuid('Viaje inválido.'),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['Aceptado', 'Rechazado', 'Cancelado']),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
