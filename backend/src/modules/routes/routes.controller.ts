import type { Request, Response } from 'express';

import { HttpError } from '../../shared/utils/http-error';
import { createRouteSchema, searchRouteSchema, updateRouteSchema } from './routes.dto';
import {
  createNewRoute,
  deleteExistingRoute,
  getRouteById,
  listRoutes,
  updateExistingRoute,
} from './routes.service';

export async function listRoutesHandler(req: Request, res: Response): Promise<void> {
  const parsed = searchRouteSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: 'Parámetros de búsqueda inválidos.' });
    return;
  }
  const routes = await listRoutes(parsed.data);
  res.json({ routes });
}

export async function getRouteHandler(req: Request, res: Response): Promise<void> {
  try {
    const route = await getRouteById(req.params.id);
    res.json({ route });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function createRouteHandler(req: Request, res: Response): Promise<void> {
  const parsed = createRouteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de ruta inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  const route = await createNewRoute(parsed.data);
  res.status(201).json({ route });
}

export async function updateRouteHandler(req: Request, res: Response): Promise<void> {
  const parsed = updateRouteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de ruta inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const route = await updateExistingRoute(req.params.id, parsed.data);
    res.json({ route });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function deleteRouteHandler(req: Request, res: Response): Promise<void> {
  try {
    await deleteExistingRoute(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}
