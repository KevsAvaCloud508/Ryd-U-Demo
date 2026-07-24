import { api } from '../../../shared/api/axios';
import type { Trip, TripInput, TripSearchParams } from '../types/trips.types';

export async function fetchTrips(params?: TripSearchParams): Promise<Trip[]> {
  const { data } = await api.get<{ trips: Trip[] }>('/trips', { params });
  return data.trips;
}

export async function fetchMyTripsAsDriver(): Promise<Trip[]> {
  const { data } = await api.get<{ trips: Trip[] }>('/trips/mine');
  return data.trips;
}

export async function fetchTripById(id: string): Promise<Trip> {
  const { data } = await api.get<{ trip: Trip }>(`/trips/${id}`);
  return data.trip;
}

export async function createTripRequest(input: TripInput): Promise<Trip> {
  const { data } = await api.post<{ trip: Trip }>('/trips', input);
  return data.trip;
}

export async function updateTripRequest(id: string, input: Partial<TripInput & { status: string }>): Promise<Trip> {
  const { data } = await api.patch<{ trip: Trip }>(`/trips/${id}`, input);
  return data.trip;
}

export async function deleteTripRequest(id: string): Promise<void> {
  await api.delete(`/trips/${id}`);
}
