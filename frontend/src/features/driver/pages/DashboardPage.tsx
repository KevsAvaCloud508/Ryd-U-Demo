import { useEffect, useState } from 'react';

import { useAuth } from '../../auth/hooks/useAuth';
import { useRatings } from '../../ratings/hooks/useRatings';
import { useRequests } from '../../requests/hooks/useRequests';
import { useTrips } from '../../trips/hooks/useTrips';
import { ActionButtons, Avatar, PageHeader, StatCard, StatusBadge } from '../../../shared/components';
import { isDemoSession } from '../../../shared/utils/session';
import type { RequestItem } from './RequestsPage';
import { saveRequests } from './RequestsPage';

const STORAGE_KEY = 'rydu_driver_requests';

interface TripRowProps {
  date: string;
  time: string;
  route: string;
  passengers: number;
  status: string;
  income: string;
}

function loadCompletedRequests(): TripRowProps[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const requests: RequestItem[] = JSON.parse(raw);
    return requests
      .filter((r) => r.status === 'completadas')
      .map((r) => {
        const totalIncome = r.seatsNum * r.pricePerSeat;
        return {
          date: r.completedAt
            ? new Date(r.completedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
            : '—',
          time: r.time,
          route: r.route,
          passengers: r.seatsNum,
          status: 'Completado',
          income: `+$${totalIncome}`,
        };
      });
  } catch {
    return [];
  }
}

function loadPendingRequests(): RequestItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const requests: RequestItem[] = JSON.parse(raw);
    return requests.filter((r) => r.status === 'pendientes');
  } catch {
    return [];
  }
}

function TripRow({ date, time, route, passengers, status, income }: TripRowProps) {
  return (
    <tr className="border-b border-[#353535] last:border-0">
      <td className="py-4 pr-4">
        <span className="font-semibold text-white">{date}</span>
        <br />
        <span className="text-[15px] text-[#8F8F8F]">{time}</span>
      </td>
      <td className="py-4 pr-4 text-[15px] text-white">{route}</td>
      <td className="py-4 pr-4 text-center text-[15px] text-white">{passengers}</td>
      <td className="py-4 pr-4">
        <StatusBadge icon="bi bi-check-circle">{status}</StatusBadge>
      </td>
      <td className="py-4 text-right font-semibold text-white">{income}</td>
    </tr>
  );
}

interface DashboardRequestCardProps {
  request: RequestItem;
  onAccept?: () => void;
  onReject?: () => void;
}

function DashboardRequestCard({ request, onAccept, onReject }: DashboardRequestCardProps) {
  return (
    <div className="rounded-[20px] border border-[#353535] bg-[#1F1F1F] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#303030] text-lg font-bold text-white">
            {request.initial}
          </div>
          <div>
            <p className="font-bold text-white">{request.name}</p>
            <div className="flex items-center gap-1 text-sm text-[#8F8F8F]">
              <i className="bi bi-star-fill text-xs text-white/80" />
              <span>{request.rating}</span>
              <span className="mx-1.5">·</span>
              <i className="bi bi-geo-alt text-xs" />
              <span className="truncate max-w-[100px]">{request.route.split('→')[0].trim()}</span>
            </div>
          </div>
        </div>
        <span className="rounded-full border border-[#353535] px-3 py-0.5 text-[13px] text-[#8F8F8F]">
          {request.seats}
        </span>
      </div>
      <ActionButtons size="sm" className="mt-4" onAccept={onAccept} onReject={onReject} />
    </div>
  );
}

const defaultTrips: TripRowProps[] = [
  // Solo viajes extra que NO están en las solicitudes completadas (evita duplicados)
  { date: '25 Jul', time: '6:45', route: 'Colonia del Valle → UPA', passengers: 4, status: 'Completado', income: '+$180' },
  { date: '22 Jul', time: '9:00', route: 'Las Lomas → UPA', passengers: 3, status: 'Completado', income: '+$105' },
  { date: '20 Jul', time: '12:30', route: 'Haciendas del Valle → UPA', passengers: 2, status: 'Completado', income: '+$80' },
];

// Mapa de estado del viaje real → etiqueta/icono del StatusBadge.
const tripStatusConfig: Record<string, { icon: string; label: string }> = {
  Pendiente: { icon: 'bi bi-clock', label: 'Pendiente' },
  EnProceso: { icon: 'bi bi-play-circle', label: 'En curso' },
  Terminado: { icon: 'bi bi-check-circle', label: 'Completado' },
};

export function DriverDashboardPage() {
  const { user } = useAuth();
  const isDemo = isDemoSession();

  // ── Datos reales (solo cuando hay API) ──
  const { trips, loadMine } = useTrips();
  const { average, loadAverage } = useRatings();
  const { updateStatus } = useRequests();

  useEffect(() => {
    if (isDemo) return;
    loadMine();
    loadAverage();
  }, [isDemo, loadMine, loadAverage]);

  // ── Datos demo (localStorage) ──
  const completedTrips = loadCompletedRequests();
  const allTrips = [...completedTrips, ...defaultTrips];

  const [pendingRequests, setPendingRequests] = useState<RequestItem[]>(loadPendingRequests);

  const handleDashboardAccept = (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all: RequestItem[] = JSON.parse(raw);
        const updated = all.map((r) =>
          r.id === id ? { ...r, status: 'aceptadas' as const } : r,
        );
        saveRequests(updated);
      }
    } catch { /* ignore */ }

    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDashboardReject = (id: string) => {
    // Eliminar completamente del localStorage y del dashboard
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all: RequestItem[] = JSON.parse(raw);
        const updated = all.filter((r) => r.id !== id);
        saveRequests(updated);
      }
    } catch { /* ignore */ }

    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // Sincronizar cuando cambien las solicitudes desde otra pestaña o al volver
  useEffect(() => {
    const syncFromStorage = () => setPendingRequests(loadPendingRequests());

    window.addEventListener('storage', syncFromStorage);
    // También sincronizar cuando el componente recupera el foco (ej. al volver de Solicitudes)
    window.addEventListener('focus', syncFromStorage);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('focus', syncFromStorage);
    };
  }, []);

  // ── Aceptar/rechazar solicitudes reales ──
  const handleRealAccept = async (requestId: string) => {
    try {
      await updateStatus(requestId, { status: 'Aceptado' });
      await loadMine();
    } catch { /* la recarga mostrará el estado real */ }
  };

  const handleRealReject = async (requestId: string) => {
    try {
      await updateStatus(requestId, { status: 'Rechazado' });
      await loadMine();
    } catch { /* la recarga mostrará el estado real */ }
  };

  // ── Derivados de la API ──
  const realCompletedTrips = trips.filter((t) => t.status === 'Terminado');
  const realActiveTrips = trips.filter((t) => t.status === 'Pendiente' || t.status === 'EnProceso');
  const totalEarnings = realCompletedTrips.reduce((sum, t) => sum + Number(t.cost ?? 0), 0);
  const rating = average?.average?.toFixed(1) ?? '—';

  const realTripRows: TripRowProps[] = trips.map((t) => ({
    date: t.date ? new Date(t.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—',
    time: t.departureTime?.slice(0, 5) ?? '—',
    route: `${t.route?.origin ?? '—'} → ${t.route?.destination ?? '—'}`,
    passengers: t.requests?.filter((r) => r.status === 'Aceptado').length ?? 0,
    status: tripStatusConfig[t.status]?.label ?? t.status,
    income: t.status === 'Terminado' ? `+$${t.cost ?? 0}` : '—',
  }));

  const realPendingRequests = trips.flatMap((trip) =>
    (trip.requests ?? [])
      .filter((r) => r.status === 'Pendiente')
      .map((r) => ({
        id: r.id,
        name: `${r.passenger?.firstName ?? 'Pasajero'} ${r.passenger?.lastNamePaternal ?? ''}`.trim(),
        initial: r.passenger?.firstName?.[0] ?? 'P',
        rating: '—',
        route: `${trip.route?.origin ?? '—'} → ${trip.route?.destination ?? '—'}`,
        seats: '1 asiento',
        seatsNum: 1,
        pricePerSeat: Number(trip.cost ?? 0),
        time: trip.departureTime?.slice(0, 5) ?? '—',
        status: 'pendientes' as const,
      })),
  );

  const firstName = user?.firstName ?? 'Conductor';
  const initial = firstName[0] ?? 'C';

  return (
    <div className="px-4 pb-10 sm:px-6 lg:px-10">
      {/* Header */}
      <PageHeader title={`Hola, ${firstName}`} subtitle="Resumen de tu actividad como conductor" action={<Avatar initial={initial} size={56} variant="solid" />} />

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {isDemo ? (
          <>
            <StatCard icon="bi bi-cash-stack" label="Ganado (semana)" value="$1,240" />
            <StatCard icon="bi bi-star" label="Rating" value="4.8" />
            <StatCard icon="bi bi-route" label="Viajes" value="86" />
            <StatCard icon="bi bi-people" label="Rutas activas" value="2" />
          </>
        ) : (
          <>
            <StatCard icon="bi bi-cash-stack" label="Ganado (total)" value={`$${totalEarnings}`} />
            <StatCard icon="bi bi-star" label="Rating" value={rating} />
            <StatCard icon="bi bi-route" label="Viajes" value={String(realCompletedTrips.length)} />
            <StatCard icon="bi bi-people" label="Rutas activas" value={String(realActiveTrips.length)} />
          </>
        )}
      </div>

      {/* Bottom section */}
      <div className="mt-8 flex flex-col gap-5 xl:flex-row">
        {/* Trip History */}
        <div className="flex-1 xl:flex-[65%]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Historial de viajes</h2>
            <StatusBadge icon="bi bi-person-fill">Conductor</StatusBadge>
          </div>
          <div className="overflow-x-auto rounded-[18px] border border-[#353535] bg-[#222222] p-5">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-[#353535] text-left text-sm font-medium text-[#9A9A9A]">
                  <th className="pb-3 pr-4 font-medium">Fecha</th>
                  <th className="pb-3 pr-4 font-medium">Ruta</th>
                  <th className="pb-3 pr-4 text-center font-medium">Pasajeros</th>
                  <th className="pb-3 pr-4 font-medium">Estado</th>
                  <th className="pb-3 text-right font-medium">Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {(isDemo ? allTrips : realTripRows).map((trip, i) => (
                  <TripRow key={`${trip.date}-${trip.time}-${i}`} {...trip} />
                ))}
              </tbody>
            </table>
            {(isDemo ? allTrips : realTripRows).length === 0 && (
              <div className="py-8 text-center text-sm text-[#6B6B6B]">
                No hay viajes todavía.
              </div>
            )}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="flex-1 xl:flex-[35%]">
          <h2 className="mb-4 text-lg font-bold text-white">Solicitudes nuevas</h2>
          <div className="flex flex-col gap-[14px]">
            {(isDemo ? pendingRequests : realPendingRequests).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-[#353535] py-10">
                <i className="bi bi-inbox text-3xl text-[#4A4A4A]" />
                <p className="mt-2 text-sm text-[#6B6B6B]">No hay solicitudes pendientes</p>
              </div>
            ) : isDemo ? (
              pendingRequests.map((req) => (
                <DashboardRequestCard
                  key={req.id}
                  request={req}
                  onAccept={() => handleDashboardAccept(req.id)}
                  onReject={() => handleDashboardReject(req.id)}
                />
              ))
            ) : (
              realPendingRequests.map((req) => (
                <DashboardRequestCard
                  key={req.id}
                  request={req}
                  onAccept={() => handleRealAccept(req.id)}
                  onReject={() => handleRealReject(req.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
