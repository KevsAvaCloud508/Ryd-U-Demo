import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { HttpError } from '../../shared/utils/http-error';
import { createTripSchema, searchTripSchema, updateTripSchema } from './trips.dto';
import {
  createNewTrip,
  deleteExistingTrip,
  getTripById,
  listAvailableTrips,
  listMyTripsAsDriver,
  updateExistingTrip,
} from './trips.service';

export async function listTripsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = searchTripSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: 'Parámetros de búsqueda inválidos.' });
    return;
  }
  const trips = await listAvailableTrips(parsed.data);
  res.json({ trips });
}

export async function listMyTripsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const trips = await listMyTripsAsDriver(req.user!.sub);
  res.json({ trips });
}

export async function getTripHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const trip = await getTripById(req.params.id);
    res.json({ trip });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function createTripHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = createTripSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de viaje inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const trip = await createNewTrip(req.user!.sub, parsed.data);
    res.status(201).json({ trip });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function updateTripHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = updateTripSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de viaje inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const trip = await updateExistingTrip(req.user!.sub, req.params.id, parsed.data);
    res.json({ trip });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function deleteTripHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    await deleteExistingTrip(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}
