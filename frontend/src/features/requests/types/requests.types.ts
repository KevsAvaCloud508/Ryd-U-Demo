import type { DriverBrief, Route, Vehicle } from '../../trips/types/trips.types';

export interface TripBrief {
  id: string;
  date: string;
  departureTime: string;
  availableSeats: number;
  cost: number | null;
  route: Route;
  vehicle: Vehicle;
  driver: DriverBrief;
}

export interface TripRequest {
  id: string;
  tripId: string;
  passengerId: string;
  status: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Cancelado';
  requestedAt: string;
  trip: TripBrief;
  passenger: DriverBrief;
}

export interface TripRequestInput {
  tripId: string;
}

export interface UpdateRequestStatusInput {
  status: 'Aceptado' | 'Rechazado' | 'Cancelado';
}
