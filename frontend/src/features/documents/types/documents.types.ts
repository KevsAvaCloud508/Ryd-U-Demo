export type DocumentType = 'INE' | 'LicenciaConduccion' | 'CredencialEstudiante' | 'PolizaVigente';

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  INE: 'INE',
  LicenciaConduccion: 'Licencia de conducción',
  CredencialEstudiante: 'Credencial de estudiante',
  PolizaVigente: 'Póliza vigente',
};

export interface VerificationDocument {
  id: string;
  userId: string;
  type: DocumentType;
  fileUrl: string;
  status: 'Pendiente' | 'Aceptado' | 'Rechazado';
  notes: string | null;
  uploadedAt: string;
}

export interface UploadDocumentInput {
  type: DocumentType;
  fileUrl: string;
}
