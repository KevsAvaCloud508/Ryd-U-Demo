import { HttpError } from '../../shared/utils/http-error.js';
import { createNotification } from '../notifications/notifications.repository.js';
import {
  findAllDocuments,
  findAllVehicles,
  findVehicleById,
  getAdminStats,
  setVehicleVerified,
} from './admin.repository.js';
import type { EstadoDocumento } from '@prisma/client';

export function listAllDocuments(status?: EstadoDocumento) {
  return findAllDocuments(status);
}

export function listAllVehicles(verified?: boolean) {
  return findAllVehicles(verified);
}

/**
 * Marca un vehículo como verificado (o le retira la verificación) y
 * notifica al dueño cuando se verifica.
 */
export async function verifyVehicle(vehicleId: string, isVerified: boolean) {
  const vehicle = await findVehicleById(vehicleId);
  if (!vehicle) {
    throw new HttpError('Vehículo no encontrado.', 404);
  }

  const updated = await setVehicleVerified(vehicleId, isVerified);

  if (isVerified && !vehicle.isVerified) {
    await createNotification(
      vehicle.userId,
      'Vehículo verificado',
      `Tu vehículo ${vehicle.brand} ${vehicle.model} (${vehicle.plates}) fue verificado correctamente.`,
    );
  }

  return updated;
}

export function stats() {
  return getAdminStats();
}
