import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import { searchTrips, loadMyTrips, loadTripById, createTrip, updateTrip, removeTrip } from '../store/trips.slice';
import type { TripInput, TripSearchParams } from '../types/trips.types';

export function useTrips() {
  const dispatch = useAppDispatch();
  const { items, currentTrip, status, error } = useAppSelector((state) => state.trips);

  const search = useCallback((params?: TripSearchParams) => dispatch(searchTrips(params)).unwrap(), [dispatch]);
  const loadMine = useCallback(() => dispatch(loadMyTrips()).unwrap(), [dispatch]);
  const loadById = useCallback((id: string) => dispatch(loadTripById(id)).unwrap(), [dispatch]);
  const create = useCallback((input: TripInput) => dispatch(createTrip(input)).unwrap(), [dispatch]);
  const update = useCallback((id: string, input: Partial<TripInput & { status: string }>) => dispatch(updateTrip({ id, input })).unwrap(), [dispatch]);
  const remove = useCallback((id: string) => dispatch(removeTrip(id)).unwrap(), [dispatch]);

  return {
    trips: items,
    currentTrip,
    isLoading: status === 'loading',
    error,
    search,
    loadMine,
    loadById,
    create,
    update,
    remove,
  };
}

export function useMyTrips() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.trips);

  const create = useCallback((input: TripInput) => dispatch(createTrip(input)).unwrap(), [dispatch]);
  const update = useCallback((id: string, input: Partial<TripInput & { status: string }>) => dispatch(updateTrip({ id, input })).unwrap(), [dispatch]);
  const remove = useCallback((id: string) => dispatch(removeTrip(id)).unwrap(), [dispatch]);

  return {
    trips: items,
    isLoading: status === 'loading',
    error,
    create,
    update,
    remove,
  };
}
