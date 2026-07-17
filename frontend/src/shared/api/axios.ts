import axios from 'axios';

/**
 * Instancia base de Axios para comunicarse con la API del backend.
 *
 * Centraliza la `baseURL` (leída de la variable de entorno `VITE_API_URL`) y la
 * cabecera por defecto. Los servicios de cada feature reutilizarán esta instancia
 * en lugar de importar `axios` directamente. Aquí no hay lógica de negocio ni
 * interceptores todavía.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
