import { MOCK_TOKEN_PREFIX, tokenStorage } from './token-storage';

/**
 * Indica si la sesión actual es de demostración (mock).
 * En modo demo no hay backend disponible: las vistas deben conservar su
 * comportamiento actual (datos de ejemplo / localStorage) en lugar de
 * intentar consumir la API real.
 */
export function isDemoSession(): boolean {
  const token = tokenStorage.get();
  return Boolean(token && token.startsWith(MOCK_TOKEN_PREFIX));
}
