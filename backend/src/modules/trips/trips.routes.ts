import { Router } from 'express';

import { requireAuth, requireRole } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  createTripHandler,
  deleteTripHandler,
  getTripHandler,
  listMyTripsHandler,
  listTripsHandler,
  updateTripHandler,
} from './trips.controller.js';

export const tripsRouter = Router();

// Rutas públicas (solo autenticación)
tripsRouter.get('/', requireAuth, asyncHandler(listTripsHandler));
tripsRouter.get('/mine', requireAuth, requireRole('DRIVER'), asyncHandler(listMyTripsHandler));
tripsRouter.get('/:id', requireAuth, asyncHandler(getTripHandler));

// Rutas protegidas (solo conductores)
tripsRouter.post('/', requireAuth, requireRole('DRIVER'), asyncHandler(createTripHandler));
tripsRouter.patch('/:id', requireAuth, requireRole('DRIVER'), asyncHandler(updateTripHandler));
tripsRouter.delete('/:id', requireAuth, requireRole('DRIVER'), asyncHandler(deleteTripHandler));
