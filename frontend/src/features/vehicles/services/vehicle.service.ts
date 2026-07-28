import { api } from '../../../shared/api/axios';
import type { Vehicle, VehicleInput } from '../types/vehicle.types';

export async function fetchMyVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get<{ vehicles: Vehicle[] }>('/vehicles');
  return data.vehicles;
}

export async function createVehicleRequest(input: VehicleInput): Promise<Vehicle> {
  const { data } = await api.post<{ vehicle: Vehicle }>('/vehicles', input);
  return data.vehicle;
}

export async function updateVehicleRequest(id: string, input: Partial<VehicleInput>): Promise<Vehicle> {
  const { data } = await api.patch<{ vehicle: Vehicle }>(`/vehicles/${id}`, input);
  return data.vehicle;
}

export async function deleteVehicleRequest(id: string): Promise<void> {
  await api.delete(`/vehicles/${id}`);
}
