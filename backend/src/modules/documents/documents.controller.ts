import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware.js';
import { HttpError } from '../../shared/utils/http-error.js';
import { deleteUploadedFile, publicFileUrl } from '../../shared/utils/upload.js';
import { updateDocumentStatusSchema, uploadDocumentSchema } from './documents.dto.js';
import { listMyDocuments, uploadDocument, deleteDocumentById, reviewDocument } from './documents.service.js';

/**
 * GET /api/documents - Lista documentos del usuario autenticado.
 */
export async function listDocumentsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const documents = await listMyDocuments(req.user!.sub);
  res.json({ documents });
}

/**
 * POST /api/documents/upload - Sube un documento con archivo real via multipart.
 * El archivo se sube a Cloudinary y la URL se almacena en la base de datos.
 */
export async function uploadDocumentHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  // multer adjunta el archivo en req.file
  if (!req.file) {
    res.status(400).json({ message: 'No se adjunto ningun archivo.' });
    return;
  }

  const parsed = uploadDocumentSchema.safeParse({
    type: req.body.type,
    fileUrl: publicFileUrl(req.file),
  });

  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de documento invalidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const document = await uploadDocument(req.user!.sub, parsed.data);
    res.status(201).json({ document });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

/**
 * DELETE /api/documents/:id - Elimina un documento y su archivo de Cloudinary.
 */
export async function deleteDocumentHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const doc = await deleteDocumentById(req.user!.sub, id);
    // Eliminar el archivo físico (Cloudinary o disco local)
    await deleteUploadedFile(doc.fileUrl);
    res.json({ message: 'Documento eliminado correctamente.' });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

/**
 * PATCH /api/documents/:id/status - Aprueba o rechaza un documento (solo ADMIN).
 */
export async function updateDocumentStatusHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = updateDocumentStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de revisión inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const document = await reviewDocument(req.params.id, parsed.data);
    res.json({ document });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}
