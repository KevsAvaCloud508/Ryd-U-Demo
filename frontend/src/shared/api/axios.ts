import axios from 'axios';

import { tokenStorage } from '../utils/token-storage';

/**
 * Instancia base de Axios para comunicarse con la API del backend.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el token JWT (si existe) a cada petición saliente.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Un 401 significa que el token ya no es válido: se limpia para forzar un nuevo login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
    }
    return Promise.reject(error);
  },
);
