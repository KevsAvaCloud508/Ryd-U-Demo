import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware.js';
import { HttpError } from '../../shared/utils/http-error.js';
import { createRatingSchema } from './ratings.dto.js';
import { getUserAverageRating, listRatingsReceived, submitRating } from './ratings.service.js';

export async function submitRatingHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = createRatingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de calificación inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const rating = await submitRating(req.user!.sub, parsed.data);
    res.status(201).json({ rating });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function listMyRatingsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const ratings = await listRatingsReceived(req.user!.sub);
  res.json({ ratings });
}

export async function getMyAverageRatingHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await getUserAverageRating(req.user!.sub);
  res.json(result);
}
