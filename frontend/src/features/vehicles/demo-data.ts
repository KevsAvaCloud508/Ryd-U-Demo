import type { Vehicle } from './types/vehicle.types';

// Vehículo por defecto mientras no exista backend (demo local).
// Los datos son inventados pero cumplen el esquema del formulario de solicitud de cambio.
export const DEFAULT_VEHICLE: Vehicle = {
  id: 'local-demo',
  userId: 'local-demo',
  brand: 'Ford',
  model: 'Aveo',
  color: 'Blanco',
  plates: 'HMR-452-A',
  capacity: 5,
  year: 2018,
  isVerified: true,
};
