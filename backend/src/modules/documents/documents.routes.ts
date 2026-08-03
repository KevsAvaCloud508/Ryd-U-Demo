import { Router } from 'express';

import { requireAuth, requireRole } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { uploadMiddleware } from '../../shared/utils/upload.js';
import {
  listDocumentsHandler,
  uploadDocumentHandler,
  deleteDocumentHandler,
  updateDocumentStatusHandler,
} from './documents.controller.js';

export const documentsRouter = Router();

documentsRouter.use(requireAuth);

documentsRouter.get('/', asyncHandler(listDocumentsHandler));
documentsRouter.post('/upload', uploadMiddleware.single('file'), asyncHandler(uploadDocumentHandler));
documentsRouter.patch('/:id/status', requireRole('ADMIN'), asyncHandler(updateDocumentStatusHandler));
documentsRouter.delete('/:id', asyncHandler(deleteDocumentHandler));
