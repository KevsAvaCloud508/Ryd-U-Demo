import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware.js';
import { HttpError } from '../../shared/utils/http-error.js';
import { listDocumentsQuerySchema, listVehiclesQuerySchema, verifyVehicleSchema } from './admin.dto.js';
import { listAllDocuments, listAllVehicles, stats, verifyVehicle } from './admin.service.js';

/**
 * GET /api/admin/documents?status=Pendiente - Lista documentos de todos los usuarios.
 */
export async function listAdminDocumentsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = listDocumentsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: 'Filtro de estado inválido.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const documents = await listAllDocuments(parsed.data.status);
  res.json({ documents });
}

/**
 * GET /api/admin/vehicles?verified=false - Lista vehículos de todos los conductores.
 */
export async function listAdminVehiclesHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = listVehiclesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: 'Filtro de verificación inválido.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const verified = parsed.data.verified === undefined ? undefined : parsed.data.verified === 'true';
  const vehicles = await listAllVehicles(verified);
  res.json({ vehicles });
}

/**
 * PATCH /api/admin/vehicles/:id/verify - Verifica o retira verificación de un vehículo.
 */
export async function verifyVehicleHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = verifyVehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de verificación inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const vehicle = await verifyVehicle(req.params.id, parsed.data.isVerified);
    res.json({ vehicle });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

/**
 * GET /api/admin/stats - Contadores para el panel de administración.
 */
export async function adminStatsHandler(_req: AuthenticatedRequest, res: Response): Promise<void> {
  res.json({ stats: await stats() });
}
