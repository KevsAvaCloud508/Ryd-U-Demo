import { prisma } from '../../prisma/client.js';
import type { TipoDocumento, EstadoDocumento } from '@prisma/client';
import type { UploadDocumentInput } from './documents.dto.js';

export function findDocumentsByUser(userId: string) {
  return prisma.verificationDocument.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' },
  });
}

export function findDocumentById(id: string) {
  return prisma.verificationDocument.findUnique({ where: { id } });
}

export function findDocumentByType(userId: string, type: string) {
  return prisma.verificationDocument.findFirst({
    where: { userId, type: type as TipoDocumento },
  });
}

export function createDocument(userId: string, data: UploadDocumentInput) {
  return prisma.verificationDocument.create({
    data: {
      userId,
      type: data.type as TipoDocumento,
      fileUrl: data.fileUrl,
    },
  });
}

export function updateDocumentStatus(id: string, status: string, notes?: string) {
  return prisma.verificationDocument.update({
    where: { id },
    data: { status: status as EstadoDocumento, notes },
  });
}

export function deleteDocument(id: string) {
  return prisma.verificationDocument.delete({ where: { id } });
}
