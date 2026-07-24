import { api } from '../../../shared/api/axios';
import type { VerificationDocument } from '../types/documents.types';
import type { DocumentType } from '../types/documents.types';

/**
 * Obtiene la lista de documentos del usuario autenticado.
 */
export async function fetchMyDocuments(): Promise<VerificationDocument[]> {
  const { data } = await api.get<{ documents: VerificationDocument[] }>('/documents');
  return data.documents;
}

/**
 * Sube un archivo real a Cloudinary via multipart/form-data.
 * @param type - Tipo de documento (INE, LicenciaConduccion, etc.)
 * @param file - Archivo seleccionado por el usuario
 */
export async function uploadDocumentFile(type: DocumentType, file: File): Promise<VerificationDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const { data } = await api.post<{ document: VerificationDocument }>('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.document;
}

/**
 * Elimina un documento por ID.
 */
export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`/documents/${documentId}`);
}
