import type { Role } from '../types/auth';

// Ruta de inicio de cada rol, usada para redirigir tras login/registro y desde rutas protegidas.
export const roleHomePath: Record<Role, string> = {
  STUDENT: '/pasajero/inicio',
  DRIVER: '/conductor/panel',
};

// Ruta de verificacion de documentos de cada rol, usada para redirigir tras registro.
export const roleVerificationPath: Record<Role, string> = {
  STUDENT: '/pasajero/validacion',
  DRIVER: '/conductor/validacion',
};
