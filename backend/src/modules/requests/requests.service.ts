import { HttpError } from '../../shared/utils/http-error';
import {
  createRequest,
  findRequestById,
  findRequestByTripAndPassenger,
  findRequestsByPassenger,
  findRequestsByTrip,
  updateRequestStatus,
} from './requests.repository';
import { findTripById } from '../trips/trips.repository';
import type { CreateRequestInput, UpdateRequestStatusInput } from './requests.dto';

export async function requestTrip(passengerId: string, input: CreateRequestInput) {
  const trip = await findTripById(input.tripId);
  if (!trip) throw new HttpError('Viaje no encontrado.', 404);

  if (trip.driverId === passengerId) {
    throw new HttpError('No puedes solicitar tu propio viaje.', 400);
  }

  if (trip.availableSeats < 1) {
    throw new HttpError('Este viaje ya no tiene asientos disponibles.', 400);
  }

  const existing = await findRequestByTripAndPassenger(input.tripId, passengerId);
  if (existing) {
    throw new HttpError('Ya enviaste una solicitud para este viaje.', 409);
  }

  return createRequest(input.tripId, passengerId);
}

export async function getRequestDetail(requestId: string) {
  const request = await findRequestById(requestId);
  if (!request) throw new HttpError('Solicitud no encontrada.', 404);
  return request;
}

export function listTripRequests(tripId: string) {
  return findRequestsByTrip(tripId);
}

export function listMyRequests(passengerId: string) {
  return findRequestsByPassenger(passengerId);
}

// El conductor acepta o rechaza una solicitud. El pasajero cancela mediante `cancelMyRequest`.
export async function updateRequest(userId: string, requestId: string, input: UpdateRequestStatusInput) {
  const request = await findRequestById(requestId);
  if (!request) throw new HttpError('Solicitud no encontrada.', 404);

  if (request.trip.driverId !== userId) {
    throw new HttpError('No tienes permiso para modificar esta solicitud.', 403);
  }

  return updateRequestStatus(requestId, input.status);
}

export async function cancelMyRequest(userId: string, requestId: string) {
  const request = await findRequestById(requestId);
  if (!request) throw new HttpError('Solicitud no encontrada.', 404);
  if (request.passenger.id !== userId) {
    throw new HttpError('No puedes cancelar una solicitud que no te pertenece.', 403);
  }
  return updateRequestStatus(requestId, 'Cancelado');
}
