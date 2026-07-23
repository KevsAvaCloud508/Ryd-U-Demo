import type { NextFunction, Request, Response } from 'express';

import { verifyAuthToken, type AuthTokenPayload } from '../utils/jwt';

// Adjunta el payload del JWT a la request para que los controllers protegidos lo consulten.
export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

// Verifica el header Authorization (`Bearer <token>`) y rechaza la petición si falta o es inválido.
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}
