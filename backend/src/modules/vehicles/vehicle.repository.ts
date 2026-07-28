import { prisma } from '../../prisma/client';
import type { CreateVehicleInput, UpdateVehicleInput } from './vehicle.dto';

export function findVehiclesByUser(userId: string) {
  return prisma.vehicle.findMany({ where: { userId }, orderBy: { brand: 'asc' } });
}

export function findVehicleById(id: string) {
  return prisma.vehicle.findUnique({ where: { id } });
}

export function findVehicleByPlates(plates: string) {
  return prisma.vehicle.findUnique({ where: { plates } });
}

export function createVehicle(userId: string, data: CreateVehicleInput) {
  return prisma.vehicle.create({ data: { ...data, userId } });
}

export function updateVehicle(id: string, data: UpdateVehicleInput) {
  return prisma.vehicle.update({ where: { id }, data });
}

export function deleteVehicle(id: string) {
  return prisma.vehicle.delete({ where: { id } });
}
