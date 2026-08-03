import { z } from 'zod';

export const listDocumentsQuerySchema = z.object({
  status: z.enum(['Pendiente', 'Aceptado', 'Rechazado']).optional(),
});

export const listVehiclesQuerySchema = z.object({
  verified: z.enum(['true', 'false']).optional(),
});

export const verifyVehicleSchema = z.object({
  isVerified: z.boolean({ message: 'isVerified debe ser booleano.' }),
});

export type ListDocumentsQuery = z.infer<typeof listDocumentsQuerySchema>;
export type ListVehiclesQuery = z.infer<typeof listVehiclesQuerySchema>;
export type VerifyVehicleInput = z.infer<typeof verifyVehicleSchema>;
