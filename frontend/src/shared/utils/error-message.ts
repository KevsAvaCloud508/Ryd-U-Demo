import { isAxiosError } from 'axios';

// Extrae el mensaje de error que envía la API (`{ message }`) o cae a un texto por defecto.
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;
  }
  return fallback;
}
