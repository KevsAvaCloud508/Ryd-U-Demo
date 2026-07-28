import { prisma } from '../../prisma/client';
import type { Prisma } from '@prisma/client';
import type { CreateRouteInput, UpdateRouteInput } from './routes.dto';

export function findRoutesByQuery(origin?: string, destination?: string, query?: string) {
  const where: Prisma.RouteWhereInput = {};

  if (query) {
    where.OR = [
      { origin: { contains: query, mode: 'insensitive' } },
      { destination: { contains: query, mode: 'insensitive' } },
    ];
  } else {
    if (origin) where.origin = { contains: origin, mode: 'insensitive' };
    if (destination) where.destination = { contains: destination, mode: 'insensitive' };
  }

  return prisma.route.findMany({ where, orderBy: { origin: 'asc' } });
}

export function findRouteById(id: string) {
  return prisma.route.findUnique({ where: { id } });
}

export function createRoute(data: CreateRouteInput) {
  return prisma.route.create({ data });
}

export function updateRoute(id: string, data: UpdateRouteInput) {
  return prisma.route.update({ where: { id }, data });
}

export function deleteRoute(id: string) {
  return prisma.route.delete({ where: { id } });
}
