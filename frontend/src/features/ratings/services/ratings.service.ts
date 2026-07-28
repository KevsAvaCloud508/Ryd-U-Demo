import { api } from '../../../shared/api/axios';
import type { AverageRating, Rating, RatingInput } from '../types/ratings.types';

export async function fetchMyRatings(): Promise<Rating[]> {
  const { data } = await api.get<{ ratings: Rating[] }>('/ratings/mine');
  return data.ratings;
}

export async function fetchMyAverageRating(): Promise<AverageRating> {
  const { data } = await api.get<AverageRating>('/ratings/average');
  return data;
}

export async function submitRating(input: RatingInput): Promise<Rating> {
  const { data } = await api.post<{ rating: Rating }>('/ratings', input);
  return data.rating;
}
