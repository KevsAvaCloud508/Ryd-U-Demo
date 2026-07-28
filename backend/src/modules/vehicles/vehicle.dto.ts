import { z } from 'zod';

export const createVehicleSchema = z.object({
  brand: z.string().trim().min(2, 'La marca es obligatoria.'),
  model: z.string().trim().min(1, 'El modelo es obligatorio.'),
  color: z.string().trim().min(2, 'El color es obligatorio.'),
  plates: z.string().trim().min(5, 'Las placas son obligatorias.').max(15),
  capacity: z.number().int().min(2, 'La capacidad debe ser mayor a 1.'),
  year: z.number().int().min(1980).max(2100).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
