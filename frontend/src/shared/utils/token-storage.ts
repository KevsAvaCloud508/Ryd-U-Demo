const TOKEN_KEY = 'rydu_token';

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
