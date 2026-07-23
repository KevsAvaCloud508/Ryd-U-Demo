import type { Request, Response } from 'express';

import { registerSchema } from './auth.dto';
import { AuthError, register } from './auth.service';

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
