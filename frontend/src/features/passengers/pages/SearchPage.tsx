import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, MapRoute, Navbar, Pill, SeatPicker, StopRow } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTrips } from '../../trips/hooks/useTrips';
import { useRequests } from '../../requests/hooks/useRequests';
import { useToast } from '../../../shared/toast/ToastProvider';
import type { Trip } from '../../trips/types/trips.types';

const DESTINATION = 'Universidad Politecnica de Aguascalientes';

// Parse coordenadas del campo description (formato: "lat,lng")
function parseCoords(description: string | null): [number, number] | null {
  if (!description) return null;
  const parts = description.split(',').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return null;
}

export function PassengerSearchPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trips, search } = useTrips();
  const { request } = useRequests();
  const { showToast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);

  useEffect(() => {
    search({ destination: DESTINATION });
  }, [search]);

  // Coordenadas del viaje seleccionado
  const selectedOriginCoords = useMemo(() => {
    if (!selectedTrip) return null;
    return parseCoords(selectedTrip.route?.description ?? null);
  }, [selectedTrip]);

  // Filtrar viajes por horario
  const getFilteredTrips = () => {
    return trips.filter((trip) => {
      if (!trip.departureTime) return true;
      const hour = parseInt(trip.departureTime.split(':')[0], 10);
      switch (selectedTime) {
        case 0: return true;
        case 1: return hour >= 6 && hour < 12;
        case 2: return hour >= 12 && hour < 18;
        case 3: return hour >= 18 || hour < 6;
        default: return true;
      }
    });
  };

  // Filtrar por busqueda
  const getSearchFilteredTrips = () => {
    const filtered = getFilteredTrips();
    if (!searchQuery) return filtered;
    const q = searchQuery.toLowerCase();
    return filtered.filter((trip) =>
      trip.route?.origin?.toLowerCase().includes(q) ||
      trip.driver?.firstName?.toLowerCase().includes(q) ||
      trip.vehicle?.brand?.toLowerCase().includes(q)
    );
  };

  const filteredTrips = getSearchFilteredTrips();

  const handleBookSeat = async () => {
    if (!selectedTrip) return;
    setIsBooking(true);
    try {
      await request({ tripId: selectedTrip.id });
      showToast('Solicitud enviada al conductor.', 'success');
      setSelectedTrip(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al solicitar el viaje.', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      <Navbar
        links={[
          { label: 'Inicio', href: '/pasajero/inicio-preview' },
          { label: 'Buscar', href: '/pasajero/buscar-preview', active: true },
          { label: 'Actividad', href: '/pasajero/actividad' },
          { label: 'Perfil', href: '/pasajero/perfil' },
        ]}
        right={
          <>
            <Pill variant="dark"><i className="bi bi-person-walking" /> Pasajero</Pill>
            <NotificationBell />
            <Avatar initial={user?.firstName?.[0] ?? 'U'} photoUrl={user?.photoUrl} onClick={() => navigate('/pasajero/perfil')} />
          </>
        }
      />
      <div className="grid h-[calc(100vh-64px)]" style={{ gridTemplateColumns: '330px 1fr 320px' }}>
        {/* Listado de rutas */}
        <div className="overflow-auto border-r border-line p-5">
          <div className="relative">
            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por origen, conductor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface pl-9 pr-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 my-3.5">
            <Pill variant={selectedTime === 0 ? 'white' : 'outline'} onClick={() => setSelectedTime(0)}>Todos</Pill>
            <Pill variant={selectedTime === 1 ? 'white' : 'outline'} onClick={() => setSelectedTime(1)}>Mañana</Pill>
            <Pill variant={selectedTime === 2 ? 'white' : 'outline'} onClick={() => setSelectedTime(2)}>Tarde</Pill>
            <Pill variant={selectedTime === 3 ? 'white' : 'outline'} onClick={() => setSelectedTime(3)}>Noche</Pill>
          </div>

          <Card className="p-3 mb-3 bg-surface">
            <div className="flex items-center gap-2">
              <i className="bi bi-geo-alt-fill text-green-400" />
              <div className="flex-1">
                <div className="text-[11px] text-muted">Destino fijo</div>
                <div className="text-xs text-white font-semibold">{DESTINATION}</div>
              </div>
            </div>
          </Card>

          <div className="mb-2 text-xs font-bold text-muted">{filteredTrips.length} VIAJES DISPONIBLES</div>
          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              className={`mt-2.5 p-3.5 cursor-pointer first:mt-0 transition-all ${selectedTrip?.id === trip.id ? 'border-white/40 bg-surface' : 'hover:bg-surface/50'}`}
              onClick={() => setSelectedTrip(trip)}
            >
              <div className="flex items-center gap-3">
                <Avatar initial={trip.driver?.firstName?.[0] ?? 'C'} photoUrl={trip.driver?.photoUrl} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <b className="text-sm text-white">{trip.driver?.firstName ?? 'Conductor'}</b>
                    <b className="text-white">${trip.cost ?? '—'}</b>
                  </div>
                  <div className="text-xs text-white">
                    <i className="bi bi-star-fill" /> {trip.vehicle?.brand} {trip.vehicle?.model}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span><i className="bi bi-clock" /> {trip.departureTime?.slice(0, 5)} · {trip.availableSeats} asientos</span>
                <span className="text-white/60">{trip.route?.distanceKm} km</span>
              </div>
              <div className="mt-1.5 text-[11px] text-muted">
                <i className="bi bi-circle-fill text-[6px] mr-1" /> {trip.route?.origin}
              </div>
            </Card>
          ))}
          {filteredTrips.length === 0 && (
            <div className="mt-8 text-center text-sm text-muted">
              <i className="bi bi-search text-2xl block mb-2" />
              No hay viajes disponibles para esta busqueda.
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className="relative">
          <MapRoute
            originCoords={selectedOriginCoords ?? undefined}
            originLabel={selectedTrip?.route?.origin}
            className="h-full"
          />
          <div className="absolute bottom-4 left-4 right-4 z-[1000]">
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <i className="bi bi-mortarboard-fill text-green-400" />
                </div>
                <div className="flex-1">
                  <b className="text-sm text-white">{DESTINATION}</b>
                  <div className="text-xs text-muted">Todas las rutas van hacia aqui</div>
                </div>
                {selectedOriginCoords && (
                  <div className="text-right">
                    <div className="text-xs text-muted">Distancia</div>
                    <div className="text-sm font-bold text-white">{selectedTrip?.route?.distanceKm ?? '—'} km</div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Detalle de la ruta seleccionada */}
        <div className="overflow-auto border-l border-line p-5">
          {selectedTrip ? (
            <>
              <b className="text-base font-extrabold tracking-tight text-white">{DESTINATION}</b>
              <div className="text-xs text-muted mt-1">
                <i className="bi bi-clock" /> Salida {selectedTrip.departureTime?.slice(0, 5)} · ${selectedTrip.cost}
              </div>

              <Card className="mt-3 p-3.5">
                <div className="flex items-center gap-3">
                  <Avatar initial={selectedTrip.driver?.firstName?.[0] ?? 'C'} photoUrl={selectedTrip.driver?.photoUrl} />
                  <div>
                    <b className="text-sm text-white">{selectedTrip.driver?.firstName}</b>
                    <div className="text-xs text-white">
                      <i className="bi bi-star-fill" /> 4.8 · <i className="bi bi-patch-check-fill" /> verificado
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="mt-2 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                    <i className="bi bi-car-front text-muted" />
                  </div>
                  <div>
                    <b className="text-sm text-white">{selectedTrip.vehicle?.brand} {selectedTrip.vehicle?.model}</b>
                    <div className="text-xs text-muted">{selectedTrip.vehicle?.color} · {selectedTrip.vehicle?.plates}</div>
                  </div>
                </div>
              </Card>

              <div className="my-3.5 mb-1.5 text-xs font-semibold text-muted">Ruta</div>
              <StopRow label={selectedTrip.route?.origin} time={selectedTrip.departureTime?.slice(0, 5) ?? '—'} active />
              <div className="ml-4 border-l-2 border-dashed border-muted/30 h-4" />
              <StopRow label={DESTINATION} time="Destino" />

              <div className="flex gap-3 mt-3">
                <Card className="flex-1 p-2.5 text-center">
                  <div className="text-lg font-bold text-white">{selectedTrip.route?.distanceKm ?? '—'}</div>
                  <div className="text-[10px] text-muted">km</div>
                </Card>
                <Card className="flex-1 p-2.5 text-center">
                  <div className="text-lg font-bold text-white">{selectedTrip.route?.estimatedMinutes ?? '—'}</div>
                  <div className="text-[10px] text-muted">min</div>
                </Card>
              </div>

              <div className="my-3.5 mb-1.5 text-xs font-semibold text-muted">Asientos: {selectedTrip.availableSeats}</div>
              <SeatPicker
                seats={Array.from({ length: selectedTrip.vehicle?.capacity ?? 4 }, (_, i) => ({
                  state: i < (selectedTrip.vehicle?.capacity ?? 4) - selectedTrip.availableSeats ? 'busy' as const : (i === (selectedTrip.vehicle?.capacity ?? 4) - selectedTrip.availableSeats ? 'selected' as const : 'free' as const),
                  content: i < (selectedTrip.vehicle?.capacity ?? 4) - selectedTrip.availableSeats
                    ? <i className="bi bi-x" />
                    : i === (selectedTrip.vehicle?.capacity ?? 4) - selectedTrip.availableSeats
                      ? <i className="bi bi-check" />
                      : `${i + 1}`,
                }))}
              />

              <Card className="mt-3.5 flex items-center justify-between p-3.5">
                <b className="text-white">Total</b>
                <b className="text-lg text-white">${selectedTrip.cost ?? '0.00'}</b>
              </Card>
              <Button fullWidth className="mt-3" onClick={handleBookSeat} disabled={isBooking}>
                {isBooking ? 'Enviando solicitud...' : 'Solicitar asiento'}
              </Button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <i className="bi bi-arrow-left text-3xl text-muted block mb-3" />
                <p className="text-sm text-muted">Selecciona un viaje para ver la ruta en el mapa</p>
                <p className="text-xs text-muted mt-1">Todas las rutas van hacia la UPA</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
