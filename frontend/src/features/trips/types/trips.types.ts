export interface DriverBrief {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  photoUrl: string | null;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  description: string | null;
  distanceKm: number | null;
  estimatedMinutes: number | null;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  color: string;
  plates: string;
  capacity: number;
}

export interface Trip {
  id: string;
  driverId: string;
  vehicleId: string;
  routeId: string;
  date: string;
  departureTime: string;
  availableSeats: number;
  cost: number | null;
  status: 'Pendiente' | 'EnProceso' | 'Terminado';
  route: Route;
  vehicle: Vehicle;
  driver: DriverBrief;
  requests?: TripRequestBrief[];
}

export interface TripRequestBrief {
  id: string;
  status: string;
  passenger: DriverBrief;
}

export interface TripInput {
  vehicleId: string;
  routeId: string;
  date: string;
  departureTime: string;
  availableSeats: number;
  cost?: number;
  description?: string;
}

export interface TripSearchParams {
  origin?: string;
  destination?: string;
  date?: string;
  driverId?: string;
}
