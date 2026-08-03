import { HttpError } from '../../shared/utils/http-error.js';
import {
  createTrip,
  deleteTrip,
  findTripById,
  findTripsByDriver,
  findTripsByQuery,
  updateTrip,
} from './trips.repository.js';
import type { CreateTripInput, SearchTripInput, UpdateTripInput } from './trips.dto.js';

export function listAvailableTrips(input: SearchTripInput) {
  return findTripsByQuery(input);
}

export function listMyTripsAsDriver(driverId: string) {
  return findTripsByDriver(driverId);
}

export async function getTripById(id: string) {
  const trip = await findTripById(id);
  if (!trip) throw new HttpError('Viaje no encontrado.', 404);
  return trip;
}

export async function createNewTrip(driverId: string, input: CreateTripInput) {
  return createTrip(driverId, input);
}

export async function updateExistingTrip(userId: string, tripId: string, input: UpdateTripInput) {
  const trip = await getTripById(tripId);
  if (trip.driverId !== userId) {
    throw new HttpError('No tienes permiso para modificar este viaje.', 403);
  }
  return updateTrip(tripId, input);
}

export async function deleteExistingTrip(userId: string, tripId: string) {
  const trip = await findTripById(tripId);
  if (!trip) throw new HttpError('Viaje no encontrado.', 404);
  if (trip.driverId !== userId) {
    throw new HttpError('No tienes permiso para eliminar este viaje.', 403);
  }
  await deleteTrip(tripId);
}
