import { prisma } from '../../prisma/client.js';
import type { EstadoDocumento } from '@prisma/client';

// Datos mínimos del dueño para mostrar en las listas de administración.
const userSummarySelect = {
  id: true,
  firstName: true,
  lastNamePaternal: true,
  email: true,
  photoUrl: true,
} as const;

export function findAllDocuments(status?: EstadoDocumento) {
  return prisma.verificationDocument.findMany({
    where: status ? { status } : undefined,
    include: { user: { select: userSummarySelect } },
    orderBy: { uploadedAt: 'desc' },
  });
}

export function findAllVehicles(verified?: boolean) {
  return prisma.vehicle.findMany({
    // `verificado` es nullable en la BD: NOT true incluye false y null.
    where:
      verified === undefined
        ? undefined
        : verified
          ? { isVerified: true }
          : { NOT: { isVerified: true } },
    include: { owner: { select: userSummarySelect } },
    orderBy: [{ isVerified: 'asc' }, { brand: 'asc' }],
  });
}

export function findVehicleById(id: string) {
  return prisma.vehicle.findUnique({ where: { id } });
}

export function setVehicleVerified(id: string, isVerified: boolean) {
  return prisma.vehicle.update({
    where: { id },
    data: { isVerified },
    include: { owner: { select: userSummarySelect } },
  });
}

export async function getAdminStats() {
  const [pendingDocuments, unverifiedVehicles, totalUsers, totalTrips] = await Promise.all([
    prisma.verificationDocument.count({ where: { status: 'Pendiente' } }),
    prisma.vehicle.count({ where: { NOT: { isVerified: true } } }),
    prisma.user.count(),
    prisma.trip.count(),
  ]);
  return { pendingDocuments, unverifiedVehicles, totalUsers, totalTrips };
}
