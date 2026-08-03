import { Router } from 'express';

import { requireAuth } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  getMyAverageRatingHandler,
  listMyRatingsHandler,
  submitRatingHandler,
} from './ratings.controller.js';

export const ratingsRouter = Router();

ratingsRouter.use(requireAuth);

ratingsRouter.get('/mine', asyncHandler(listMyRatingsHandler));
ratingsRouter.get('/average', asyncHandler(getMyAverageRatingHandler));
ratingsRouter.post('/', asyncHandler(submitRatingHandler));
