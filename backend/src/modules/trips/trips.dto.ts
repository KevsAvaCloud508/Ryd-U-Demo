import { z } from 'zod';

export const createTripSchema = z.object({
  vehicleId: z.string().uuid('Vehículo inválido.'),
  routeId: z.string().uuid('Ruta inválida.'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida.'),
  departureTime: z.string().min(1, 'La hora de salida es obligatoria.'),
  availableSeats: z.coerce.number().int().min(1, 'Debe haber al menos 1 asiento disponible.'),
  cost: z.coerce.number().min(0).optional(),
  status: z.enum(['Pendiente', 'EnProceso', 'Terminado']).optional(),
  description: z.string().trim().optional(),
});

export const updateTripSchema = z.object({
  availableSeats: z.coerce.number().int().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),
  status: z.enum(['Pendiente', 'EnProceso', 'Terminado']).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida.').optional(),
  departureTime: z.string().optional(),
});

export const searchTripSchema = z.object({
  origin: z.string().trim().optional(),
  destination: z.string().trim().optional(),
  date: z.string().optional(),
  driverId: z.string().uuid().optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type SearchTripInput = z.infer<typeof searchTripSchema>;
