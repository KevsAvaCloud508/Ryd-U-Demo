import { HttpError } from '../../shared/utils/http-error.js';
import { deleteUploadedFile } from '../../shared/utils/upload.js';
import { createNotification } from '../notifications/notifications.repository.js';
import {
  createDocument,
  deleteDocument,
  findDocumentById,
  findDocumentByType,
  findDocumentsByUser,
  updateDocumentStatus,
} from './documents.repository.js';
import type { UploadDocumentInput, UpdateDocumentStatusInput } from './documents.dto.js';

export function listMyDocuments(userId: string) {
  return findDocumentsByUser(userId);
}

export async function getDocumentById(id: string) {
  const doc = await findDocumentById(id);
  if (!doc) throw new HttpError('Documento no encontrado.', 404);
  return doc;
}

export async function uploadDocument(userId: string, input: UploadDocumentInput) {
  const existing = await findDocumentByType(userId, input.type);
  if (existing) {
    // Si ya existe, se reemplaza (registro y archivo físico)
    await deleteDocument(existing.id);
    await deleteUploadedFile(existing.fileUrl);
  }
  return createDocument(userId, input);
}

export async function deleteDocumentById(userId: string, documentId: string) {
  const doc = await getDocumentById(documentId);
  if (doc.userId !== userId) {
    throw new HttpError('No tienes permiso para eliminar este documento.', 403);
  }
  await deleteDocument(documentId);
  return doc;
}

// Etiquetas legibles para las notificaciones de revisión.
const DOCUMENT_LABELS: Record<string, string> = {
  INE: 'INE',
  LicenciaConduccion: 'Licencia de conducción',
  CredencialEstudiante: 'Credencial de estudiante',
  PolizaVigente: 'Póliza vigente',
};

/**
 * Revisión administrativa: aprueba o rechaza un documento de cualquier usuario
 * (sin check de ownership; la ruta exige rol ADMIN) y notifica al dueño.
 */
export async function reviewDocument(documentId: string, input: UpdateDocumentStatusInput) {
  const doc = await getDocumentById(documentId);
  const updated = await updateDocumentStatus(documentId, input.status, input.notes);

  const label = DOCUMENT_LABELS[doc.type] ?? doc.type;
  if (input.status === 'Aceptado') {
    await createNotification(doc.userId, 'Documento aprobado', `Tu documento "${label}" fue revisado y aprobado.`);
  } else {
    const reason = input.notes ? ` Motivo: ${input.notes}` : '';
    await createNotification(doc.userId, 'Documento rechazado', `Tu documento "${label}" fue rechazado.${reason}`);
  }

  return updated;
}
