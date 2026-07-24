import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Navbar, Pill, Segmented, StatCard } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { useAuth } from '../../auth/hooks/useAuth';
import { useRatings } from '../../ratings/hooks/useRatings';
import { useTrips } from '../../trips/hooks/useTrips';
import { useRequests } from '../../requests/hooks/useRequests';

// Vista P2 - Inicio del pasajero: proximo viaje, resumen y rutas sugeridas
export function PassengerHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trips, search } = useTrips();
  const { average, loadAverage } = useRatings();
  const { loadMine } = useRequests();
  const [timeFilter, setTimeFilter] = useState(0);

  useEffect(() => {
    search({});
    loadAverage();
    loadMine();
  }, [search, loadAverage, loadMine]);

  const upcomingTrips = trips.filter((t) => t.status === 'Pendiente').slice(0, 3);
  const currentTrip = upcomingTrips[0];

  // Filtrar viajes por horario segun la seleccion
  const getFilteredTrips = () => {
    return trips.filter((trip) => {
      if (!trip.departureTime) return true;
      const hour = parseInt(trip.departureTime.split(':')[0], 10);
      switch (timeFilter) {
        case 0: return hour >= 6 && hour < 12;  // Manana
        case 1: return hour >= 12 && hour < 18;  // Tarde
        case 2: return hour >= 18 || hour < 6;   // Noche
        default: return true;
      }
    });
  };

  const filteredTrips = getFilteredTrips();

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
      <div className="px-12 py-[30px]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Hola, {user?.firstName ?? 'Estudiante'}!
            </h2>
            <p className="mt-1 text-sm text-muted">{currentTrip ? 'Tienes un viaje proximo' : 'Busca un viaje para hoy'}</p>
          </div>
          <Segmented activeIndex={timeFilter} options={[{ label: 'Manana' }, { label: 'Tarde' }, { label: 'Noche' }]} onSelect={setTimeFilter} />
        </div>

        <div className="mt-[22px] grid gap-5" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
          {currentTrip ? (
            <Card inverted className="p-[22px] cursor-pointer hover:opacity-95 transition-opacity" onClick={() => navigate('/pasajero/buscar')}>
              <div className="flex items-center justify-between">
                <Pill variant="dark" className="bg-black text-white">
                  Tu proximo viaje
                </Pill>
                <b className="text-xl">{currentTrip.departureTime?.slice(0, 5) ?? '—'}</b>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Avatar initial={currentTrip.driver?.firstName?.[0] ?? 'C'} light />
                <div className="flex-1">
                  <b className="text-[15px]">{currentTrip.driver?.firstName ?? 'Conductor'}</b>
                  <div className="text-xs text-[#555]">
                    {currentTrip.vehicle?.brand} {currentTrip.vehicle?.model} · {currentTrip.vehicle?.color}
                  </div>
                </div>
                <span className="text-xl"><i className="bi bi-chat" /></span>
              </div>
              <div className="mt-4 text-[13px]">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-circle" /> {currentTrip.route?.origin}
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <i className="bi bi-geo-alt-fill" /> {currentTrip.route?.destination}
                </div>
              </div>
              <div className="mt-[18px] flex items-center">
                <Button className="bg-black text-white" onClick={(e) => { e.stopPropagation(); navigate('/pasajero/buscar'); }}>Ver detalles</Button>
                <b className="ml-auto text-lg">${currentTrip.cost ?? '—'}</b>
              </div>
            </Card>
          ) : (
            <Card className="p-[22px] flex items-center justify-center text-center">
              <div>
                <i className="bi bi-search text-4xl text-muted block mb-3" />
                <p className="text-muted">No tienes viajes proximos</p>
                <Button className="mt-4" onClick={() => navigate('/pasajero/buscar')}>
                  <i className="bi bi-search mr-1" /> Buscar rutas
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-[22px]">
            <b className="font-extrabold tracking-tight text-white">Resumen</b>
            <div className="mt-4 grid grid-cols-2 gap-3.5">
              <StatCard icon={<i className="bi bi-clock-history" />} label="Viajes" value={average?.count ?? 0} />
              <StatCard icon={<i className="bi bi-piggy-bank" />} label="Ahorrado" value={average ? `$${Math.round(average.count * 50)}` : '$0'} />
              <StatCard icon={<i className="bi bi-star" />} label="Rating" value={average?.average?.toFixed(1) ?? '—'} />
              <StatCard icon={<i className="bi bi-tree" />} label="CO2" value={`-${(average?.count ?? 0) * 2}kg`} />
            </div>
          </Card>
        </div>

        <div className="my-[26px] mt-[26px] flex items-center justify-between">
          <b className="text-lg font-extrabold tracking-tight text-white">Rutas disponibles</b>
          <span className="text-[13px] text-muted">{filteredTrips.length} viajes</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredTrips.length > 0 ? (
            filteredTrips.slice(0, 6).map((trip) => (
              <Card key={trip.id} className="p-4 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/pasajero/buscar')}>
                <div className="flex items-center gap-3">
                  <Avatar initial={trip.driver?.firstName?.[0] ?? 'C'} photoUrl={trip.driver?.photoUrl} />
                  <div className="flex-1">
                    <b className="text-sm text-white">{trip.driver?.firstName ?? 'Conductor'}</b>
                    <div className="text-xs text-muted">{trip.route?.origin} → {trip.route?.destination}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted">
                    <i className="bi bi-clock" /> {trip.departureTime?.slice(0, 5)} · {trip.availableSeats} asien.
                  </span>
                  <b className="text-white">${trip.cost ?? '—'}</b>
                </div>
                <div className="mt-3">
                  <Button size="sm" fullWidth onClick={(e) => { e.stopPropagation(); navigate('/pasajero/buscar'); }}>
                    <i className="bi bi-arrow-right mr-1" /> Ver viaje
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-3 p-8 flex items-center justify-center text-center">
              <div>
                <i className="bi bi-calendar-x text-4xl text-muted block mb-3" />
                <p className="text-muted">No hay viajes disponibles en este horario</p>
                <p className="text-xs text-muted mt-1">Intenta con otro horario o busca en la pagina de rutas</p>
                <Button className="mt-4" onClick={() => navigate('/pasajero/buscar')}>
                  <i className="bi bi-search mr-1" /> Ver todas las rutas
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
