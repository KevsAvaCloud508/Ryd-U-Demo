import { useMemo } from 'react';

import { useRatings } from '../../ratings/hooks/useRatings';
import { useRequests } from '../../requests/hooks/useRequests';
import { isDemoSession } from '../../../shared/utils/session';
import { DEMO_HISTORY_REQUESTS, DEMO_AVERAGE_RATING } from '../../trips/demo-data';

const SAVINGS_PER_TRIP = 50;
const CO2_KG_PER_TRIP = 2;

const TODAY = new Date().toISOString().slice(0, 10);

/**
 * Métricas del pasajero compartidas por Inicio, Actividad y Perfil.
 *
 * Todas derivan de la misma fuente: viajes realizados = solicitudes aceptadas
 * en viajes ya pasados (completados), igual que el historial de Actividad y
 * las métricas del dashboard. En modo demo se usan las solicitudes simuladas
 * (3 realizadas + 2 próximas) para que Viajes/Ahorro/Rating siempre cuadren
 * con el historial que muestra la app.
 */
export function usePassengerStats() {
  const { requests } = useRequests();
  const { average } = useRatings();
  const isDemo = isDemoSession();

  return useMemo(() => {
    // En modo demo no hay API: se calcula con las solicitudes simuladas para que
    // las estadísticas coincidan con el historial visible (3 viajes realizados).
    const source = isDemo ? DEMO_HISTORY_REQUESTS : requests;

    // Viajes realizados = solicitudes aceptadas en viajes ya pasados (completados),
    // exactamente la misma condición que el historial de Actividad.
    const tripsCount = source.filter(
      (r) => r.status === 'Aceptado' && r.trip.date.slice(0, 10) < TODAY,
    ).length;

    // En modo demo el promedio simulado es 4.9 (como el slice de ratings).
    const ratingValue = isDemo
      ? String(DEMO_AVERAGE_RATING)
      : average
        ? Number(average.average).toFixed(1)
        : null;

    return {
      tripsCount,
      savings: tripsCount * SAVINGS_PER_TRIP,
      co2Saved: tripsCount * CO2_KG_PER_TRIP,
      rating: ratingValue,
    };
  }, [isDemo, requests, average]);
}
