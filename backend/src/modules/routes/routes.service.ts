import { HttpError } from '../../shared/utils/http-error.js';
import {
  createRoute,
  deleteRoute,
  findRouteById,
  findRoutesByQuery,
  updateRoute,
} from './routes.repository.js';
import type { CreateRouteInput, SearchRouteInput, UpdateRouteInput } from './routes.dto.js';

export function listRoutes(input: SearchRouteInput) {
  return findRoutesByQuery(input.origin, input.destination, input.query);
}

export async function getRouteById(id: string) {
  const route = await findRouteById(id);
  if (!route) throw new HttpError('Ruta no encontrada.', 404);
  return route;
}

export function createNewRoute(input: CreateRouteInput) {
  return createRoute(input);
}

export async function updateExistingRoute(id: string, input: UpdateRouteInput) {
  await getRouteById(id);
  return updateRoute(id, input);
}

export async function deleteExistingRoute(id: string) {
  await getRouteById(id);
  await deleteRoute(id);
}
