import { Router } from 'express';

import { requireAuth } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  cancelRequestHandler,
  createRequestHandler,
  getRequestHandler,
  listMyRequestsHandler,
  listTripRequestsHandler,
  updateRequestHandler,
} from './requests.controller.js';

export const requestsRouter = Router();

requestsRouter.get('/mine', requireAuth, asyncHandler(listMyRequestsHandler));
requestsRouter.get('/trip/:tripId', requireAuth, asyncHandler(listTripRequestsHandler));
requestsRouter.get('/:id', requireAuth, asyncHandler(getRequestHandler));
requestsRouter.post('/', requireAuth, asyncHandler(createRequestHandler));
requestsRouter.patch('/:id', requireAuth, asyncHandler(updateRequestHandler));
requestsRouter.post('/:id/cancel', requireAuth, asyncHandler(cancelRequestHandler));
