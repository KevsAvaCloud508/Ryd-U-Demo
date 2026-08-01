import { prisma } from '../../prisma/client.js';
import type { Prisma } from '@prisma/client';
import type { CreateTripInput, SearchTripInput, UpdateTripInput } from './trips.dto.js';

export function findTripsByQuery(input: SearchTripInput) {
  const where: Prisma.TripWhereInput = {};

  if (input.driverId) where.driverId = input.driverId;
  if (input.date) where.date = new Date(input.date);

  if (input.origin || input.destination) {
    where.route = {};
    if (input.origin) (where.route as Prisma.RouteWhereInput).origin = { contains: input.origin, mode: 'insensitive' };
    if (input.destination)
      (where.route as Prisma.RouteWhereInput).destination = { contains: input.destination, mode: 'insensitive' };
  }

  return prisma.trip.findMany({
    where,
    include: { route: true, vehicle: true, driver: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } } },
    orderBy: { date: 'asc' },
  });
}

export function findTripById(id: string) {
  return prisma.trip.findUnique({
    where: { id },
    include: {
      route: true,
      vehicle: true,
      driver: { select: { id: true, firstName: true, lastNamePaternal: true, lastNameMaternal: true, photoUrl: true } },
      requests: { include: { passenger: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } } } },
    },
  });
}

export function findTripsByDriver(driverId: string) {
  return prisma.trip.findMany({
    where: { driverId },
    include: { route: true, vehicle: true, requests: true },
    orderBy: { date: 'desc' },
  });
}

export function createTrip(driverId: string, data: CreateTripInput) {
  return prisma.trip.create({
    data: {
      driverId,
      vehicleId: data.vehicleId,
      routeId: data.routeId,
      date: new Date(data.date),
      departureTime: new Date(`1970-01-01T${data.departureTime}`),
      availableSeats: data.availableSeats,
      cost: data.cost,
    },
  });
}

export function updateTrip(id: string, data: UpdateTripInput) {
  const updateData: Record<string, unknown> = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  return prisma.trip.update({ where: { id }, data: updateData as Prisma.TripUpdateInput });
}

export function deleteTrip(id: string) {
  return prisma.trip.delete({ where: { id } });
}
