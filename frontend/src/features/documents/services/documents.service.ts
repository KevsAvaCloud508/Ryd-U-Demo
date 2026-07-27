import { api } from '../../../shared/api/axios';
import type { VerificationDocument, DocumentType } from '../types/documents.types';

export async function fetchMyDocuments(): Promise<VerificationDocument[]> {
  const { data } = await api.get<{ documents: VerificationDocument[] }>('/documents');
  return data.documents;
}

export async function uploadDocumentFile(file: File, type: DocumentType): Promise<VerificationDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const { data } = await api.post<{ document: VerificationDocument }>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.document;
}

export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`/documents/${documentId}`);
}
