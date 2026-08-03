import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import { isDemoSession } from '../../../shared/utils/session';
import { addVehicle, editVehicle, fetchVehicles, removeVehicle } from '../store/vehicle.slice';
import type { VehicleInput } from '../types/vehicle.types';

// Carga y expone los vehículos del conductor autenticado, con las mutaciones CRUD ya conectadas al store.
export function useVehicles() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.vehicles);

  useEffect(() => {
    // En modo demo no hay API: no disparar llamadas con token mock.
    if (isDemoSession()) return;
    dispatch(fetchVehicles());
  }, [dispatch]);

  const create = useCallback((input: VehicleInput) => dispatch(addVehicle(input)).unwrap(), [dispatch]);
  const update = useCallback(
    (id: string, input: Partial<VehicleInput>) => dispatch(editVehicle({ id, input })).unwrap(),
    [dispatch],
  );
  const remove = useCallback((id: string) => dispatch(removeVehicle(id)).unwrap(), [dispatch]);

  return {
    vehicles: items,
    isLoading: status === 'loading',
    error,
    create,
    update,
    remove,
  };
}
