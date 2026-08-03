import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Navbar, Pill, Segmented, StatCard } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { useAuth } from '../../auth/hooks/useAuth';
import { useRatings } from '../../ratings/hooks/useRatings';
import { DEMO_HISTORY_REQUESTS, DEMO_AVERAGE_RATING } from '../../trips/demo-data';
import { useRequests } from '../../requests/hooks/useRequests';
import { usePassengerStats } from '../hooks/usePassengerStats';
import { isDemoSession } from '../../../shared/utils/session';
import { formatTime } from '../../../shared/utils/format-time';
import { formatDate } from '../../../shared/utils/format-date';
import type { TripBrief } from '../../requests/types/requests.types';

const TODAY = new Date().toISOString().slice(0, 10);

type TripStatus = 'Completado' | 'Confirmado' | 'Solicitado' | 'Rechazado' | 'Cancelado' | 'Próximo';

interface MyTrip {
  trip: TripBrief;
  status: TripStatus;
}

// Vista P2 - Inicio del pasajero: próximo viaje, resumen y mis viajes
export function PassengerHomePage() {
  const isDemo = isDemoSession();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { average, loadAverage } = useRatings();
  const { requests, loadMine } = useRequests();
  const { tripsCount, savings, co2Saved, rating } = usePassengerStats();
  const [timeFilter, setTimeFilter] = useState(0);

  useEffect(() => {
    // En modo demo no hay API: no disparar llamadas con token mock.
    if (isDemo) return;
    loadAverage();
    loadMine();
  }, [isDemo, loadAverage, loadMine]);

  // Viajes del pasajero. En modo demo se simulan con los viajes demo.
  const myTrips = useMemo<MyTrip[]>(() => {
    if (isDemo) {
      // Modo demo: mismas solicitudes simuladas que Actividad (3 realizadas + 2 próximas).
      return DEMO_HISTORY_REQUESTS
        .map((r) => {
          const past = r.trip.date.slice(0, 10) < TODAY;
          const status: TripStatus =
            r.status === 'Rechazado' ? 'Rechazado'
            : r.status === 'Cancelado' ? 'Cancelado'
            : past ? 'Completado'
            : r.status === 'Aceptado' ? 'Confirmado'
            : 'Solicitado';
          return { trip: r.trip, status };
        })
        .sort((a, b) => b.trip.date.slice(0, 10).localeCompare(a.trip.date.slice(0, 10)));
    }
    return requests
      .map((r) => {
        const past = r.trip.date.slice(0, 10) < TODAY;
        const status: TripStatus =
          r.status === 'Rechazado' ? 'Rechazado'
          : r.status === 'Cancelado' ? 'Cancelado'
          : past ? 'Completado'
          : r.status === 'Aceptado' ? 'Confirmado'
          : 'Solicitado';
        return { trip: r.trip, status };
      })
      .sort((a, b) => b.trip.date.slice(0, 10).localeCompare(a.trip.date.slice(0, 10)));
  }, [isDemo, requests]);

  // Próximo viaje: la solicitud confirmada o pendiente con la fecha más cercana.
  const currentTrip =
    myTrips
      .filter((t) => t.status === 'Confirmado' || t.status === 'Solicitado' || t.status === 'Próximo')
      .sort((a, b) => a.trip.date.slice(0, 10).localeCompare(b.trip.date.slice(0, 10)))[0]?.trip ?? null;

  // Filtrar viajes por horario según la selección
  const getFilteredTrips = () => {
    if (timeFilter === 0) return myTrips;
    return myTrips.filter(({ trip }) => {
      const hour = parseInt(formatTime(trip.departureTime).split(':')[0], 10);
      if (isNaN(hour)) return true;
      switch (timeFilter) {
        case 1: return hour >= 6 && hour < 12;  // Mañana
        case 2: return hour >= 12 && hour < 18; // Tarde
        case 3: return hour >= 18 || hour < 6;  // Noche
        default: return true;
      }
    });
  };

  const filteredTrips = getFilteredTrips();

  // Desglose del listado filtrado (siempre cuadra con el Resumen, incluso con filtro de horario).
  const realizedCount = filteredTrips.filter((t) => t.status === 'Completado').length;
  const upcomingCount = filteredTrips.length - realizedCount;

  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      <Navbar
        links={[
          { label: 'Inicio', href: '/pasajero/inicio', active: true },
          { label: 'Buscar', href: '/pasajero/buscar' },
          { label: 'Actividad', href: '/pasajero/actividad' },
          { label: 'Perfil', href: '/pasajero/perfil' },
        ]}
        right={
          <>
            <Pill variant="dark">
              <i className="bi bi-person-walking" /> Pasajero
            </Pill>
            <NotificationBell />
            <Avatar initial={user?.firstName?.[0] ?? 'U'} photoUrl={user?.photoUrl} onClick={() => navigate('/pasajero/perfil')} />
          </>
        }
      />
      <div className="px-4 py-[30px] sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Hola, {user?.firstName ?? 'Estudiante'}!
            </h2>
            <p className="mt-1 text-sm text-muted">{currentTrip ? 'Listo para tu próximo viaje' : 'Busca un viaje para hoy'}</p>
          </div>
          <Segmented
            activeIndex={timeFilter}
            options={[{ label: 'Todos' }, { label: 'Mañana' }, { label: 'Tarde' }, { label: 'Noche' }]}
            onSelect={setTimeFilter}
          />
        </div>

        <div className="mt-[22px] grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {currentTrip ? (
            <Card inverted className="p-4 flex flex-col justify-between cursor-pointer hover:opacity-95 transition-opacity" onClick={() => navigate('/pasajero/actividad')}>
              <div className="flex items-center justify-between">
                <Pill variant="dark" style={{ backgroundColor: '#000', color: '#fff' }}>
                  Tu próximo viaje
                </Pill>
                <b className="text-sm">{formatTime(currentTrip.departureTime)}</b>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <Avatar initial={currentTrip.driver?.firstName?.[0] ?? 'C'} light size={32} />
                <div className="flex-1">
                  <b className="text-xs">{currentTrip.driver?.firstName ?? 'Conductor'}</b>
                  <div className="text-[11px] text-[#555]">
                    <i className="bi bi-star-fill mr-0.5 text-[#f5b301]" /> {average?.average?.toFixed(1) ?? (isDemo ? String(DEMO_AVERAGE_RATING) : '—')} · {currentTrip.vehicle?.brand ?? ''} {currentTrip.vehicle?.model ?? ''} · {currentTrip.vehicle?.color ?? ''}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <i className="bi bi-circle" /> {currentTrip.route?.origin}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <i className="bi bi-geo-alt-fill" /> {currentTrip.route?.destination}
                </div>
              </div>
              <div className="mt-2.5 flex items-center">
                <Button variant="dark" size="sm" style={{ backgroundColor: '#141414', color: '#fff' }} onClick={(e) => { e.stopPropagation(); navigate('/pasajero/actividad'); }}>Ver detalles</Button>
                <b className="ml-auto text-sm">${currentTrip.cost ?? '—'}</b>
              </div>
            </Card>
          ) : (
            <Card className="p-[22px] flex items-center justify-center text-center">
              <div>
                <i className="bi bi-search text-4xl text-muted block mb-3" />
                <p className="text-muted">No tienes viajes próximos</p>
                <Button className="mt-4" onClick={() => navigate('/pasajero/buscar')}>
                  <i className="bi bi-search mr-1" /> Buscar rutas
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <b className="font-extrabold tracking-tight text-white">Resumen</b>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <StatCard compact icon="bi bi-clock-history" label="Realizados" value={String(tripsCount)} />
              <StatCard compact icon="bi bi-piggy-bank" label="Ahorrado" value={`$${savings}`} />
              <StatCard compact icon="bi bi-star" label="Rating" value={rating ?? '—'} />
              <StatCard compact icon="bi bi-tree" label="CO2" value={`-${co2Saved}kg`} />
            </div>
          </Card>
        </div>

        <div className="my-[26px] mt-[26px] flex items-center justify-between">
          <b className="text-lg font-extrabold tracking-tight text-white">Mis viajes</b>
          <span className="text-[13px] text-muted">{realizedCount} realizados · {upcomingCount} próximos</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.length > 0 ? (
            filteredTrips.slice(0, 6).map(({ trip, status }) => (
              <Card key={trip.id} className="p-4 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/pasajero/actividad')}>
                <div className="flex items-center gap-3">
                  <Avatar initial={trip.driver?.firstName?.[0] ?? 'C'} photoUrl={trip.driver?.photoUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <b className="truncate text-sm text-white">{trip.driver?.firstName ?? 'Conductor'}</b>
                      <Pill variant={status === 'Completado' ? 'dark' : 'outline'}>{status}</Pill>
                    </div>
                    <div className="truncate text-xs text-muted">{trip.route?.origin} → {trip.route?.destination}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted">
                    <i className="bi bi-calendar3 mr-1" />{formatDate(trip.date)} · <i className="bi bi-clock" /> {formatTime(trip.departureTime)}
                  </span>
                  <b className="text-white">${trip.cost ?? '—'}</b>
                </div>
                <div className="mt-3">
                  <Button size="sm" fullWidth onClick={(e) => { e.stopPropagation(); navigate('/pasajero/actividad'); }}>
                    <i className="bi bi-arrow-right mr-1" /> Ver detalle
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full p-8 flex items-center justify-center text-center">
              <div>
                <i className="bi bi-calendar-x text-4xl text-muted block mb-3" />
                <p className="text-muted">Aún no tienes viajes</p>
                <p className="text-xs text-muted mt-1">Busca una ruta y reserva tu primer asiento</p>
                <Button className="mt-4" onClick={() => navigate('/pasajero/buscar')}>
                  <i className="bi bi-search mr-1" /> Buscar rutas
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
