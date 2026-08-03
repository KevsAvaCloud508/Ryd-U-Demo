const TOKEN_KEY = 'rydu_token';

// Prefijo de los tokens generados por el login demo (sin backend).
export const MOCK_TOKEN_PREFIX = 'mock_token_';

// Centraliza el acceso a localStorage para que el token tenga un único punto de
// lectura/escritura (usado por el store de auth y el interceptor de axios).
export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// El login demo genera tokens mock que el backend real rechaza; el modo demo
// se detecta aquí para simular en el cliente (auth, documentos, etc.).
export function isDemoMode(): boolean {
  return tokenStorage.get()?.startsWith(MOCK_TOKEN_PREFIX) ?? false;
}
