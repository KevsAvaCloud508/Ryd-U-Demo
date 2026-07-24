import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import { loadAverageRating, loadMyRatings, rateTrip } from '../store/ratings.slice';
import type { RatingInput } from '../types/ratings.types';

export function useRatings() {
  const dispatch = useAppDispatch();
  const { items, average, status, error } = useAppSelector((state) => state.ratings);

  const loadMine = useCallback(() => dispatch(loadMyRatings()).unwrap(), [dispatch]);
  const loadAverage = useCallback(() => dispatch(loadAverageRating()).unwrap(), [dispatch]);
  const submit = useCallback((input: RatingInput) => dispatch(rateTrip(input)).unwrap(), [dispatch]);

  return {
    ratings: items,
    average,
    isLoading: status === 'loading',
    error,
    loadMine,
    loadAverage,
    submit,
  };
}
