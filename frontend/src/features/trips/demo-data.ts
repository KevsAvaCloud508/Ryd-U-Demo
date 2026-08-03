import type { Trip } from './types/trips.types';
import type { TripRequest } from '../requests/types/requests.types';

/** Promedio de calificación simulado del modo demo (fuente única). */
export const DEMO_AVERAGE_RATING = 4.9;

/**
 * Viajes de demostración para el modo demo (login con token mock, sin backend).
 * Reflejan la misma forma de datos que devuelve GET /trips.
 */
export const DEMO_TRIPS: Trip[] = [
  {
    id: 'demo-trip-1',
    driverId: 'a1899850-7031-435b-92d7-3d3f86db115b',
    vehicleId: 'demo-vehicle-1',
    routeId: 'demo-route-1',
    date: '2026-08-05',
    departureTime: '08:15',
    availableSeats: 3,
    cost: 30,
    status: 'Pendiente',
    route: {
      id: 'demo-route-1',
      origin: 'Plaza Vestir',
      destination: 'UPA - Universidad Politécnica de Aguascalientes',
      description: '21.8611,-102.2783;21.807037,-102.296021',
      distanceKm: 9.8,
      estimatedMinutes: 20,
    },
    vehicle: { id: 'demo-vehicle-1', brand: 'Nissan', model: 'Versa', color: 'Rojo', plates: 'AGS-123-A', capacity: 4 },
    driver: { id: 'a1899850-7031-435b-92d7-3d3f86db115b', firstName: 'Carlos', lastNamePaternal: 'Ramírez', photoUrl: null },
  },
  {
    id: 'demo-trip-2',
    driverId: 'b2f1c3d4-1111-4a2b-9c3d-000000000002',
    vehicleId: 'demo-vehicle-2',
    routeId: 'demo-route-2',
    date: '2026-08-05',
    departureTime: '07:00',
    availableSeats: 2,
    cost: 45,
    status: 'Pendiente',
    route: {
      id: 'demo-route-2',
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Jesús María',
      description: '21.807037,-102.296021;21.9615,-102.3430',
      distanceKm: 18.3,
      estimatedMinutes: 35,
    },
    vehicle: { id: 'demo-vehicle-2', brand: 'Volkswagen', model: 'Jetta', color: 'Gris', plates: 'AGS-456-B', capacity: 4 },
    driver: { id: 'b2f1c3d4-1111-4a2b-9c3d-000000000002', firstName: 'María', lastNamePaternal: 'González', photoUrl: null },
  },
  {
    id: 'demo-trip-3',
    driverId: 'a1899850-7031-435b-92d7-3d3f86db115b',
    vehicleId: 'demo-vehicle-1',
    routeId: 'demo-route-3',
    date: '2026-08-06',
    departureTime: '14:30',
    availableSeats: 2,
    cost: 35,
    status: 'Pendiente',
    route: {
      id: 'demo-route-3',
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Centro de Aguascalientes',
      description: '21.807037,-102.296021;21.8826,-102.2966',
      distanceKm: 12.5,
      estimatedMinutes: 25,
    },
    vehicle: { id: 'demo-vehicle-1', brand: 'Nissan', model: 'Versa', color: 'Rojo', plates: 'AGS-123-A', capacity: 4 },
    driver: { id: 'a1899850-7031-435b-92d7-3d3f86db115b', firstName: 'Carlos', lastNamePaternal: 'Ramírez', photoUrl: null },
  },
  {
    id: 'demo-trip-4',
    driverId: 'b2f1c3d4-1111-4a2b-9c3d-000000000002',
    vehicleId: 'demo-vehicle-2',
    routeId: 'demo-route-4',
    date: '2026-08-07',
    departureTime: '15:45',
    availableSeats: 4,
    cost: 35,
    status: 'Pendiente',
    route: {
      id: 'demo-route-4',
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Centro de Aguascalientes',
      description: '21.807037,-102.296021;21.8826,-102.2966',
      distanceKm: 12.5,
      estimatedMinutes: 25,
    },
    vehicle: { id: 'demo-vehicle-2', brand: 'Volkswagen', model: 'Jetta', color: 'Gris', plates: 'AGS-456-B', capacity: 4 },
    driver: { id: 'b2f1c3d4-1111-4a2b-9c3d-000000000002', firstName: 'María', lastNamePaternal: 'González', photoUrl: null },
  },
  {
    id: 'demo-trip-5',
    driverId: 'a1899850-7031-435b-92d7-3d3f86db115b',
    vehicleId: 'demo-vehicle-1',
    routeId: 'demo-route-5',
    date: '2026-08-07',
    departureTime: '18:00',
    availableSeats: 4,
    cost: 40,
    status: 'Pendiente',
    route: {
      id: 'demo-route-5',
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Villas de Nuestra Señora de la Asunción',
      description: '21.807037,-102.296021;21.8420,-102.2350',
      distanceKm: 15.0,
      estimatedMinutes: 30,
    },
    vehicle: { id: 'demo-vehicle-1', brand: 'Nissan', model: 'Versa', color: 'Rojo', plates: 'AGS-123-A', capacity: 4 },
    driver: { id: 'a1899850-7031-435b-92d7-3d3f86db115b', firstName: 'Carlos', lastNamePaternal: 'Ramírez', photoUrl: null },
  },
];

/**
 * Viajes ya realizados (historial) para el modo demo: fechas pasadas y
 * estado Terminado, para que Actividad/Inicio no queden vacíos y cuadren
 * con "Viajes totales" del modo demo (3).
 */
export const DEMO_HISTORY_TRIPS: Trip[] = [
  {
    id: 'demo-hist-1',
    driverId: 'a1899850-7031-435b-92d7-3d3f86db115b',
    vehicleId: 'demo-vehicle-1',
    routeId: 'demo-route-1',
    date: '2026-07-10',
    departureTime: '08:15',
    availableSeats: 0,
    cost: 30,
    status: 'Terminado',
    route: {
      id: 'demo-route-1',
      origin: 'Plaza Vestir',
      destination: 'UPA - Universidad Politécnica de Aguascalientes',
      description: '21.8611,-102.2783;21.807037,-102.296021',
      distanceKm: 9.8,
      estimatedMinutes: 20,
    },
    vehicle: { id: 'demo-vehicle-1', brand: 'Nissan', model: 'Versa', color: 'Rojo', plates: 'AGS-123-A', capacity: 4 },
    driver: { id: 'a1899850-7031-435b-92d7-3d3f86db115b', firstName: 'Carlos', lastNamePaternal: 'Ramírez', photoUrl: null },
  },
  {
    id: 'demo-hist-2',
    driverId: 'b2f1c3d4-1111-4a2b-9c3d-000000000002',
    vehicleId: 'demo-vehicle-2',
    routeId: 'demo-route-2',
    date: '2026-07-15',
    departureTime: '07:00',
    availableSeats: 0,
    cost: 45,
    status: 'Terminado',
    route: {
      id: 'demo-route-2',
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Jesús María',
      description: '21.807037,-102.296021;21.9615,-102.3430',
      distanceKm: 18.3,
      estimatedMinutes: 35,
    },
    vehicle: { id: 'demo-vehicle-2', brand: 'Volkswagen', model: 'Jetta', color: 'Gris', plates: 'AGS-456-B', capacity: 4 },
    driver: { id: 'b2f1c3d4-1111-4a2b-9c3d-000000000002', firstName: 'María', lastNamePaternal: 'González', photoUrl: null },
  },
  {
    id: 'demo-hist-3',
    driverId: 'a1899850-7031-435b-92d7-3d3f86db115b',
    vehicleId: 'demo-vehicle-1',
    routeId: 'demo-route-1',
    date: '2026-07-20',
    departureTime: '18:00',
    availableSeats: 0,
    cost: 35,
    status: 'Terminado',
    route: {
      id: 'demo-route-1',
      origin: 'Plaza Vestir',
      destination: 'UPA - Universidad Politécnica de Aguascalientes',
      description: '21.8611,-102.2783;21.807037,-102.296021',
      distanceKm: 9.8,
      estimatedMinutes: 20,
    },
    vehicle: { id: 'demo-vehicle-1', brand: 'Nissan', model: 'Versa', color: 'Rojo', plates: 'AGS-123-A', capacity: 4 },
    driver: { id: 'a1899850-7031-435b-92d7-3d3f86db115b', firstName: 'Carlos', lastNamePaternal: 'Ramírez', photoUrl: null },
  },
];

const DEMO_PASSENGER = { id: 'demo-user', firstName: 'Pasajero', lastNamePaternal: 'Demo', photoUrl: null };

/**
 * Solicitudes de demostración para el modo demo: 3 viajes realizados
 * (Completado) + 2 próximos (Confirmado / Solicitado). Reflejan la misma
 * forma de datos que GET /requests/mine y cuadran con "Viajes totales".
 */
export const DEMO_HISTORY_REQUESTS: TripRequest[] = [
  { id: 'demo-req-hist-1', tripId: 'demo-hist-1', passengerId: 'demo-user', status: 'Aceptado', requestedAt: '2026-07-10T08:00:00.000Z', trip: DEMO_HISTORY_TRIPS[0], passenger: DEMO_PASSENGER },
  { id: 'demo-req-hist-2', tripId: 'demo-hist-2', passengerId: 'demo-user', status: 'Aceptado', requestedAt: '2026-07-15T07:00:00.000Z', trip: DEMO_HISTORY_TRIPS[1], passenger: DEMO_PASSENGER },
  { id: 'demo-req-hist-3', tripId: 'demo-hist-3', passengerId: 'demo-user', status: 'Aceptado', requestedAt: '2026-07-20T18:00:00.000Z', trip: DEMO_HISTORY_TRIPS[2], passenger: DEMO_PASSENGER },
  { id: 'demo-req-up-1', tripId: 'demo-trip-1', passengerId: 'demo-user', status: 'Aceptado', requestedAt: '2026-08-01T10:00:00.000Z', trip: DEMO_TRIPS[0], passenger: DEMO_PASSENGER },
  { id: 'demo-req-up-2', tripId: 'demo-trip-3', passengerId: 'demo-user', status: 'Pendiente', requestedAt: '2026-08-02T10:00:00.000Z', trip: DEMO_TRIPS[2], passenger: DEMO_PASSENGER },
];
