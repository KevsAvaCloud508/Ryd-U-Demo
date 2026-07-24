import { api } from '../../../shared/api/axios';
import type { TripRequest, TripRequestInput, UpdateRequestStatusInput } from '../types/requests.types';

export async function fetchMyRequests(): Promise<TripRequest[]> {
  const { data } = await api.get<{ requests: TripRequest[] }>('/requests/mine');
  return data.requests;
}

export async function fetchTripRequests(tripId: string): Promise<TripRequest[]> {
  const { data } = await api.get<{ requests: TripRequest[] }>(`/requests/trip/${tripId}`);
  return data.requests;
}

export async function createRequest(input: TripRequestInput): Promise<TripRequest> {
  const { data } = await api.post<{ request: TripRequest }>('/requests', input);
  return data.request;
}

export async function updateRequestStatus(id: string, input: UpdateRequestStatusInput): Promise<TripRequest> {
  const { data } = await api.patch<{ request: TripRequest }>(`/requests/${id}`, input);
  return data.request;
}

export async function cancelRequest(id: string): Promise<TripRequest> {
  const { data } = await api.post<{ request: TripRequest }>(`/requests/${id}/cancel`);
  return data.request;
}
