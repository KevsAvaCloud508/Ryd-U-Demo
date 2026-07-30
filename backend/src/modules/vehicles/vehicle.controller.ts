import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { HttpError } from '../../shared/utils/http-error';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.dto';
import { createMyVehicle, deleteMyVehicle, listMyVehicles, updateMyVehicle } from './vehicle.service';

function handleError(error: unknown, res: Response): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }
  throw error;
}

export async function listVehiclesHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const vehicles = await listMyVehicles(req.user!.sub);
  res.status(200).json({ vehicles });
}

export async function createVehicleHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = createVehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de vehículo inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const vehicle = await createMyVehicle(req.user!.sub, parsed.data);
    res.status(201).json({ vehicle });
  } catch (error) {
    handleError(error, res);
  }
}

export async function updateVehicleHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = updateVehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos de vehículo inválidos.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const vehicle = await updateMyVehicle(req.user!.sub, req.params.id, parsed.data);
    res.status(200).json({ vehicle });
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteVehicleHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    await deleteMyVehicle(req.user!.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
}
