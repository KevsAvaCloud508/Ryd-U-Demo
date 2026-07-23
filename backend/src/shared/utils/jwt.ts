import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import type { AppRole } from '../../modules/auth/auth.dto';

export interface AuthTokenPayload {
  sub: string;
  role: AppRole;
}

// No hay flujo de refresh token en la arquitectura actual, así que se usa la
// vigencia configurada en JWT_EXPIRES_IN para no forzar reinicios de sesión frecuentes.
export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
