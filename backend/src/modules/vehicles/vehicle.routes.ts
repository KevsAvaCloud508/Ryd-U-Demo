import { Router } from 'express';

import { requireAuth, requireRole } from '../../shared/middlewares/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';
import {
  createVehicleHandler,
  deleteVehicleHandler,
  listVehiclesHandler,
  updateVehicleHandler,
} from './vehicle.controller';

export const vehicleRouter = Router();

// Solo los conductores administran vehículos.
vehicleRouter.use(requireAuth, requireRole('DRIVER'));

vehicleRouter.get('/', asyncHandler(listVehiclesHandler));
vehicleRouter.post('/', asyncHandler(createVehicleHandler));
vehicleRouter.patch('/:id', asyncHandler(updateVehicleHandler));
vehicleRouter.delete('/:id', asyncHandler(deleteVehicleHandler));
