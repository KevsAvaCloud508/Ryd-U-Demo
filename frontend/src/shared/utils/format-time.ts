/**
 * Extrae la hora en formato HH:mm del valor de `departureTime`.
 *
 * La API serializa la columna TIME como "1970-01-01T06:45:00.000Z" y el modo
 * demo la usa como "06:45" directamente, así que se soportan ambos formatos.
 */
export function formatTime(value: string | null | undefined): string {
  if (!value) return '—';
  const match = value.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : value.slice(0, 5);
}
