// Lee un valor JSON de localStorage sin lanzar errores si no existe o está corrupto.
export function readStoredJSON(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

// Escribe un valor JSON en localStorage sin lanzar errores (almacenamiento no disponible).
export function writeStoredJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Almacenamiento no disponible: no se persiste nada.
  }
}

// Elimina una clave de localStorage sin lanzar errores (almacenamiento no disponible).
export function removeStoredJSON(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Almacenamiento no disponible: no se hace nada.
  }
}
