import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import { acceptOrReject, cancelMyRequest, loadMyRequests, sendRequest } from '../store/requests.slice';
import type { TripRequestInput, UpdateRequestStatusInput } from '../types/requests.types';

export function useRequests() {
  const dispatch = useAppDispatch();
  const { items, tripRequests, status, error } = useAppSelector((state) => state.requests);

  const loadMine = useCallback(() => dispatch(loadMyRequests()).unwrap(), [dispatch]);
  const request = useCallback((input: TripRequestInput) => dispatch(sendRequest(input)).unwrap(), [dispatch]);
  const updateStatus = useCallback(
    (id: string, input: UpdateRequestStatusInput) => dispatch(acceptOrReject({ id, input })).unwrap(),
    [dispatch],
  );
  const cancel = useCallback((id: string) => dispatch(cancelMyRequest(id)).unwrap(), [dispatch]);

  return {
    requests: items,
    tripRequests,
    isLoading: status === 'loading',
    error,
    loadMine,
    request,
    updateStatus,
    cancel,
  };
}
