import { z } from 'zod';

export const DOCUMENT_TYPES = ['INE', 'LicenciaConduccion', 'CredencialEstudiante', 'PolizaVigente'] as const;
export type AppDocumentType = (typeof DOCUMENT_TYPES)[number];

export const uploadDocumentSchema = z.object({
  type: z.enum(DOCUMENT_TYPES, { message: 'Tipo de documento inválido.' }),
  fileUrl: z.string().url('La URL del archivo es obligatoria.'),
});

export const updateDocumentStatusSchema = z.object({
  status: z.enum(['Aceptado', 'Rechazado']),
  notes: z.string().trim().optional(),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
export type UpdateDocumentStatusInput = z.infer<typeof updateDocumentStatusSchema>;
