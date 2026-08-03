import { Router } from 'express';

import { requireAuth } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  createRouteHandler,
  deleteRouteHandler,
  getRouteHandler,
  listRoutesHandler,
  updateRouteHandler,
} from './routes.controller.js';

export const routesRouter = Router();

routesRouter.get('/', asyncHandler(listRoutesHandler));
routesRouter.get('/:id', asyncHandler(getRouteHandler));
routesRouter.post('/', requireAuth, asyncHandler(createRouteHandler));
routesRouter.patch('/:id', requireAuth, asyncHandler(updateRouteHandler));
routesRouter.delete('/:id', requireAuth, asyncHandler(deleteRouteHandler));
