import { HttpError } from '../../shared/utils/http-error';
import {
  createRating,
  findRatingByTripAndRater,
  findRatingsByUser,
  getAverageRating,
} from './ratings.repository';
import type { CreateRatingInput } from './ratings.dto';

export async function submitRating(raterId: string, input: CreateRatingInput) {
  if (raterId === input.rateeId) {
    throw new HttpError('No puedes calificarte a ti mismo.', 400);
  }

  const existing = await findRatingByTripAndRater(input.tripId, raterId);
  if (existing) {
    throw new HttpError('Ya calificaste este viaje.', 409);
  }

  return createRating(raterId, input.tripId, input.rateeId, input.score);
}

export function listRatingsReceived(userId: string) {
  return findRatingsByUser(userId);
}

export async function getUserAverageRating(userId: string) {
  const result = await getAverageRating(userId);
  return {
    average: result._avg.score ?? 0,
    count: result._count.score,
  };
}
