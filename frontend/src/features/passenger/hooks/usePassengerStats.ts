import { useMemo } from 'react';

import { useRatings } from '../../ratings/hooks/useRatings';
import { useRequests } from '../../requests/hooks/useRequests';
import { isDemoSession } from '../../../shared/utils/session';

const SAVINGS_PER_TRIP = 50;
const CO2_KG_PER_TRIP = 2;

/**
 * Métricas del pasajero compartidas por Inicio, Actividad y Perfil.
 *
 * Todas derivan de la misma fuente: viajes realizados = solicitudes aceptadas.
 * En modo demo no hay historial real, así que se usan los valores simulados
 * del slice de ratings ({ average: 4.9, count: 3 }).
 */
export function usePassengerStats() {
  const { requests } = useRequests();
  const { average } = useRatings();

  return useMemo(() => {
    const tripsCount = isDemoSession()
      ? Number(average?.count ?? 0)
      : requests.filter((r) => r.status === 'Aceptado').length;

    return {
      tripsCount,
      savings: tripsCount * SAVINGS_PER_TRIP,
      co2Saved: tripsCount * CO2_KG_PER_TRIP,
      rating: average ? Number(average.average).toFixed(1) : null,
    };
  }, [requests, average]);
}
