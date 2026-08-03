import { z } from 'zod';

export const vehicleSchema = z.object({
  brand: z.string().trim().min(2, 'La marca es obligatoria.'),
  model: z.string().trim().min(1, 'El modelo es obligatorio.'),
  color: z.string().trim().min(2, 'El color es obligatorio.'),
  plates: z.string().trim().min(5, 'Las placas son obligatorias.').max(15, 'Máximo 15 caracteres.'),
  capacity: z.coerce.number().int().min(2, 'La capacidad debe ser mayor a 1.'),
  year: z.coerce.number().int().min(1980).max(2100).optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

// Valores por defecto del formulario, compartidos por los modales de registro y de cambio.
export const emptyVehicleFormValues: VehicleFormValues = {
  brand: '',
  model: '',
  color: '',
  plates: '',
  capacity: 4,
  year: undefined,
};
