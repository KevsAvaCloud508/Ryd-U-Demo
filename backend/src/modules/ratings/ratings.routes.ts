import { Router } from 'express';

import { requireAuth } from '../../shared/middlewares/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';
import {
  getMyAverageRatingHandler,
  listMyRatingsHandler,
  submitRatingHandler,
} from './ratings.controller';

export const ratingsRouter = Router();

ratingsRouter.use(requireAuth);

ratingsRouter.get('/mine', asyncHandler(listMyRatingsHandler));
ratingsRouter.get('/average', asyncHandler(getMyAverageRatingHandler));
ratingsRouter.post('/', asyncHandler(submitRatingHandler));
