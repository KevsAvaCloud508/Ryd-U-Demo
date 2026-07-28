import type { Request, Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { publicFileUrl } from '../../shared/utils/upload';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } from './auth.dto';
import { AuthError, forgotPassword, getCurrentUser, login, register, resetPassword, updateProfile } from './auth.service';

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

/**
 * PATCH /api/auth/profile - Actualiza el perfil del usuario autenticado.
 */
export async function updateProfileHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de perfil invalidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const user = await updateProfile(req.user!.sub, parsed.data);
    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

/**
 * POST /api/auth/photo - Sube una foto de perfil via multipart.
 * Convierte el archivo a base64 y lo almacena en la base de datos.
 */
export async function uploadPhotoHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: 'No se envio ningun archivo.' });
    return;
  }

  try {
    // El archivo ya quedó en Cloudinary o en disco local; solo guardamos su URL.
    const photoUrl = publicFileUrl(req.file);
    const user = await updateProfile(req.user!.sub, { photoUrl });
    res.status(200).json({ user, photoUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

/**
 * POST /api/auth/forgot-password - Solicita restablecimiento de contrasena.
 */
export async function forgotPasswordHandler(req: Request, res: Response): Promise<void> {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Correo invalido.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await forgotPassword(parsed.data);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

/**
 * POST /api/auth/reset-password - Restablece la contrasena con el token.
 */
export async function resetPasswordHandler(req: Request, res: Response): Promise<void> {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos invalidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await resetPassword(parsed.data);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}
