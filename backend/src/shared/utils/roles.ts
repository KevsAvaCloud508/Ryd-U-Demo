import type { AppRole } from '../../modules/auth/auth.dto';

// Traduce entre el rol de negocio usado en la API (STUDENT/DRIVER) y el nombre
// real de la fila en la tabla `rol` de la base de datos (Pasajero/Conductor).
export const roleNameByAppRole: Record<AppRole, string> = {
  STUDENT: 'Pasajero',
  DRIVER: 'Conductor',
  ADMIN: 'Administrador',
};

export const appRoleByRoleName: Record<string, AppRole> = {
  Pasajero: 'STUDENT',
  Conductor: 'DRIVER',
  Administrador: 'ADMIN',
};
