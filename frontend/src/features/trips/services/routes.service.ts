import { api } from '../../../shared/api/axios';

export interface Route {
  id: string;
  origin: string;
  destination: string;
  description: string | null;
  distanceKm: number | null;
  estimatedMinutes: number | null;
}

export interface CreateRouteInput {
  origin: string;
  destination: string;
  description?: string;
  distanceKm?: number;
  estimatedMinutes?: number;
}

/**
 * Servicio para interactuar con la API de rutas.
 * Centraliza todas las llamadas HTTP relacionadas con rutas.
 */
export async function createRoute(input: CreateRouteInput): Promise<Route> {
  const { data } = await api.post<{ route: Route }>('/routes', input);
  return data.route;
}

export async function searchRoutes(params?: {
  origin?: string;
  destination?: string;
  query?: string;
}): Promise<Route[]> {
  const { data } = await api.get<{ routes: Route[] }>('/routes', { params });
  return data.routes;
}

export async function getRouteById(id: string): Promise<Route> {
  const { data } = await api.get<{ route: Route }>(`/routes/${id}`);
  return data.route;
}
