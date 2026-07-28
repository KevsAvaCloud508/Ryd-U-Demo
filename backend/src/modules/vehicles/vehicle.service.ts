import { HttpError } from '../../shared/utils/http-error';
import {
  createVehicle,
  deleteVehicle,
  findVehicleByPlates,
  findVehicleById,
  findVehiclesByUser,
  updateVehicle,
} from './vehicle.repository';
import type { CreateVehicleInput, UpdateVehicleInput } from './vehicle.dto';

export function listMyVehicles(userId: string) {
  return findVehiclesByUser(userId);
}

export async function createMyVehicle(userId: string, input: CreateVehicleInput) {
  const existingPlates = await findVehicleByPlates(input.plates);
  if (existingPlates) {
    throw new HttpError('Ya existe un vehículo registrado con estas placas.', 409);
  }
  return createVehicle(userId, input);
}

// Verifica que el vehículo exista y pertenezca al usuario antes de editar o borrar;
// evita que un conductor manipule vehículos de otro.
async function getOwnedVehicleOrThrow(userId: string, vehicleId: string) {
  const vehicle = await findVehicleById(vehicleId);
  if (!vehicle) {
    throw new HttpError('Vehículo no encontrado.', 404);
  }
  if (vehicle.userId !== userId) {
    throw new HttpError('No tienes permiso para modificar este vehículo.', 403);
  }
  return vehicle;
}

export async function updateMyVehicle(userId: string, vehicleId: string, input: UpdateVehicleInput) {
  await getOwnedVehicleOrThrow(userId, vehicleId);

  if (input.plates) {
    const existingPlates = await findVehicleByPlates(input.plates);
    if (existingPlates && existingPlates.id !== vehicleId) {
      throw new HttpError('Ya existe un vehículo registrado con estas placas.', 409);
    }
  }

  return updateVehicle(vehicleId, input);
}

export async function deleteMyVehicle(userId: string, vehicleId: string) {
  await getOwnedVehicleOrThrow(userId, vehicleId);
  await deleteVehicle(vehicleId);
}
