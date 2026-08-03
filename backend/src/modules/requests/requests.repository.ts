import { prisma } from '../../prisma/client.js';
import type { EstadoSolicitud } from '@prisma/client';

export function findRequestById(id: string) {
  return prisma.tripRequest.findUnique({
    where: { id },
    include: {
      trip: { include: { route: true, vehicle: true, driver: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } } } },
      passenger: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } },
    },
  });
}

export function findRequestsByTrip(tripId: string) {
  return prisma.tripRequest.findMany({
    where: { tripId },
    include: { passenger: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } } },
    orderBy: { requestedAt: 'desc' },
  });
}

export function findRequestsByPassenger(passengerId: string) {
  return prisma.tripRequest.findMany({
    where: { passengerId },
    include: {
      trip: { include: { route: true, vehicle: true, driver: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } } } },
    },
    orderBy: { requestedAt: 'desc' },
  });
}

export function findRequestByTripAndPassenger(tripId: string, passengerId: string) {
  return prisma.tripRequest.findFirst({
    where: { tripId, passengerId },
  });
}

export function createRequest(tripId: string, passengerId: string) {
  return prisma.tripRequest.create({
    data: { tripId, passengerId },
    include: {
      trip: { include: { route: true } },
      passenger: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } },
    },
  });
}

export function updateRequestStatus(id: string, status: string) {
  return prisma.tripRequest.update({
    where: { id },
    data: { status: status as EstadoSolicitud },
  });
}
