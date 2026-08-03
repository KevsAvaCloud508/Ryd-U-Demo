import { Router } from 'express';

import { requireAuth, requireRole } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  adminStatsHandler,
  listAdminDocumentsHandler,
  listAdminVehiclesHandler,
  verifyVehicleHandler,
} from './admin.controller.js';

export const adminRouter = Router();

// Toda la sección de administración exige rol ADMIN.
adminRouter.use(requireAuth, requireRole('ADMIN'));

adminRouter.get('/documents', asyncHandler(listAdminDocumentsHandler));
adminRouter.get('/vehicles', asyncHandler(listAdminVehiclesHandler));
adminRouter.patch('/vehicles/:id/verify', asyncHandler(verifyVehicleHandler));
adminRouter.get('/stats', asyncHandler(adminStatsHandler));
