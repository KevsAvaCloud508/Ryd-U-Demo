import type { Request, Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { loginSchema, registerSchema } from './auth.dto';
import { AuthError, getCurrentUser, login, register } from './auth.service';

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de registro inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await register(parsed.data);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de acceso inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await login(parsed.data);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function meHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = await getCurrentUser(req.user!.sub);
    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}
