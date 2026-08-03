import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, MapRoute, Navbar, Pill, SeatPicker, StopRow } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { useAuth } from '../../auth/hooks/useAuth';
import { DEMO_TRIPS } from '../../trips/demo-data';
import { useTrips } from '../../trips/hooks/useTrips';
import { searchRoutes } from '../../trips/services/routes.service';
import { useRequests } from '../../requests/hooks/useRequests';
import { useToast } from '../../../shared/toast/ToastProvider';
import { isDemoMode } from '../../../shared/utils/token-storage';
import { formatTime } from '../../../shared/utils/format-time';
import type { Route, Trip } from '../../trips/types/trips.types';

// Hoy en formato ISO (YYYY-MM-DD) para descartar viajes ya pasados.
const TODAY = new Date().toISOString().slice(0, 10);

// Normaliza texto para búsquedas sin distinguir acentos ni mayúsculas.
function normalizeText(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Parse coordenadas del campo description: "lat,lng" (solo origen) u "lat,lng;lat,lng" (origen;destino).
function parseCoords(description: string | null): { origin: [number, number] | null; destination: [number, number] | null } {
  if (!description) return { origin: null, destination: null };
  const parse = (raw: string | undefined): [number, number] | null => {
    if (!raw) return null;
    const parts = raw.split(',').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return null;
  };
  const [originRaw, destRaw] = description.split(';');
  return { origin: parse(originRaw), destination: parse(destRaw) };
}

export function PassengerSearchPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { search } = useTrips();
  const { request } = useRequests();
  const { showToast } = useToast();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);

  useEffect(() => {
    let active = true;

    // En modo demo no hay backend: las rutas y viajes demo ya reflejan el seed.
    if (isDemoMode()) {
      setRoutes(DEMO_TRIPS.map((t) => t.route));
      setTrips(DEMO_TRIPS);
      setRoutesLoading(false);
      return;
    }

    // Modo real: todas las rutas (GET /api/routes) + todos los viajes (GET /api/trips).
    Promise.all([search(), searchRoutes()])
      .then(([allTrips, allRoutes]) => {
        if (!active) return;
        setRoutes(allRoutes);
        setTrips(allTrips);
      })
      .catch(() => {
        if (active) setRoutesError(true);
      })
      .finally(() => {
        if (active) setRoutesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search]);

  // Viajes disponibles: Pendiente y con fecha de hoy o futura.
  const availableTrips = useMemo(
    () => trips.filter((t) => t.status === 'Pendiente' && t.date.slice(0, 10) >= TODAY),
    [trips],
  );

  // Agrupa los viajes disponibles por ruta.
  const tripsByRoute = useMemo(() => {
    const grouped = new Map<string, Trip[]>();
    for (const trip of availableTrips) {
      const list = grouped.get(trip.routeId) ?? [];
      list.push(trip);
      grouped.set(trip.routeId, list);
    }
    return grouped;
  }, [availableTrips]);

  // Filtra las rutas por la búsqueda (origen/destino, sin acentos).
  const filteredRoutes = useMemo(() => {
    if (!searchQuery) return routes;
    const q = normalizeText(searchQuery);
    return routes.filter(
      (r) => normalizeText(r.origin).includes(q) || normalizeText(r.destination).includes(q),
    );
  }, [routes, searchQuery]);

  // Viajes de una ruta filtrados por el horario seleccionado.
  const getRouteTrips = (route: Route): Trip[] => {
    const routeTrips = tripsByRoute.get(route.id) ?? [];
    if (selectedTime === 0) return routeTrips;
    return routeTrips.filter((trip) => {
      if (!trip.departureTime) return false;
      const hour = parseInt(formatTime(trip.departureTime).split(':')[0], 10);
      switch (selectedTime) {
        case 1: return hour >= 6 && hour < 12;
        case 2: return hour >= 12 && hour < 18;
        case 3: return hour >= 18 || hour < 6;
        default: return true;
      }
    });
  };

  const selectRoute = (route: Route) => {
    setSelectedRoute(route);
    setSelectedTrip(null);
  };

  const selectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setSelectedRoute(trip.route);
  };

  // Ruta que se dibuja en el mapa (la del viaje seleccionado o la ruta seleccionada).
  const mapRoute = selectedTrip?.route ?? selectedRoute;
  const mapCoords = useMemo(
    () => (mapRoute ? parseCoords(mapRoute.description) : { origin: null, destination: null }),
    [mapRoute],
  );

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
          { label: 'Inicio', href: '/pasajero/inicio' },
          { label: 'Buscar', href: '/pasajero/buscar', active: true },
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
      <div className="grid grid-cols-1 lg:h-[calc(100vh-64px)] lg:grid-cols-[330px_1fr_320px]">
        {/* ================= Listado de rutas ================= */}
        <div className="border-b border-line p-5 lg:overflow-auto lg:border-b-0 lg:border-r">
          <div className="relative">
            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar ruta por origen o destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface pl-9 pr-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 my-3.5">
            <Pill variant={selectedTime === 0 ? 'white' : 'outline'} onClick={() => setSelectedTime(0)}>Todos</Pill>
            <Pill variant={selectedTime === 1 ? 'white' : 'outline'} onClick={() => setSelectedTime(1)}>Manana</Pill>
            <Pill variant={selectedTime === 2 ? 'white' : 'outline'} onClick={() => setSelectedTime(2)}>Tarde</Pill>
            <Pill variant={selectedTime === 3 ? 'white' : 'outline'} onClick={() => setSelectedTime(3)}>Noche</Pill>
          </div>

          <div className="mb-2 text-xs font-bold text-muted">{filteredRoutes.length} RUTAS DISPONIBLES</div>

          {filteredRoutes.map((route) => {
            const routeTrips = getRouteTrips(route);
            const isActive = selectedRoute?.id === route.id || selectedTrip?.routeId === route.id;
            return (
              <Card
                key={route.id}
                className={`mt-2.5 p-3.5 first:mt-0 cursor-pointer transition-all ${isActive ? 'border-white/40 bg-surface' : 'hover:bg-surface/50'}`}
                onClick={() => selectRoute(route)}
              >
                {/* Origen → Destino */}
                <div className="flex items-center gap-2">
                  <i className="bi bi-circle-fill text-[7px] text-green-400" />
                  <span className="flex-1 truncate text-sm font-semibold text-white">{route.origin}</span>
                </div>
                <div className="ml-[3px] h-3 border-l-2 border-dashed border-muted/40" />
                <div className="flex items-center gap-2">
                  <i className="bi bi-geo-alt-fill text-[10px] text-blue-400" />
                  <span className="flex-1 truncate text-sm font-semibold text-white">{route.destination}</span>
                </div>

                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
                  <span><i className="bi bi-signpost" /> {route.distanceKm ?? '—'} km</span>
                  <span><i className="bi bi-clock" /> {route.estimatedMinutes ?? '—'} min</span>
                  <span className="ml-auto text-white/60">{routeTrips.length} viajes</span>
                </div>

                {/* Viajes disponibles de esta ruta */}
                {routeTrips.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {routeTrips.map((trip) => (
                      <div
                        key={trip.id}
                        onClick={(e) => { e.stopPropagation(); selectTrip(trip); }}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 transition-all cursor-pointer ${selectedTrip?.id === trip.id ? 'border-white/40 bg-surface2' : 'border-line bg-surface/70 hover:border-white/20'}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <b className="text-sm text-white">{formatTime(trip.departureTime)}</b>
                            <span className="truncate text-[11px] text-muted">
                              {trip.driver?.firstName} · {trip.vehicle?.brand} {trip.vehicle?.model}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted">
                            <i className="bi bi-people mr-1" />{trip.availableSeats} asientos · {trip.vehicle?.color}
                          </div>
                        </div>
                        <b className="text-white">${trip.cost ?? '—'}</b>
                        <i className="bi bi-chevron-right text-muted" />
                      </div>
                    ))}
                  </div>
                )}
                {routeTrips.length === 0 && (
                  <p className="mt-2.5 text-[11px] text-muted">
                    <i className="bi bi-calendar-x mr-1" />Sin viajes disponibles en este horario
                  </p>
                )}
              </Card>
            );
          })}

          {filteredRoutes.length === 0 && (
            <div className="mt-8 text-center text-sm text-muted">
              <i className="bi bi-signpost-split text-2xl block mb-2" />
              {routesError
                ? 'No se pudieron cargar las rutas. Verifica que el backend esté encendido.'
                : routesLoading
                  ? 'Cargando rutas...'
                  : 'No hay rutas para esta búsqueda.'}
            </div>
          )}
        </div>

        {/* ================= Mapa ================= */}
        <div className="relative h-[260px] border-b border-line lg:h-auto lg:border-b-0">
          <MapRoute
            originCoords={mapCoords.origin ?? undefined}
            originLabel={mapRoute?.origin}
            destinationCoords={mapCoords.destination ?? undefined}
            destinationLabel={mapRoute?.destination}
            className="h-full"
          />
          <div className="absolute bottom-4 left-4 right-4 z-[1000]">
            <Card className="p-3">
              {mapRoute ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                    <i className="bi bi-mortarboard-fill text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm text-white">{mapRoute.origin}</b>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <i className="bi bi-arrow-right text-[10px]" />
                      <span className="truncate">{mapRoute.destination}</span>
                    </div>
                  </div>
                  {mapCoords.origin && mapCoords.destination && (
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-muted">Distancia</div>
                      <div className="text-sm font-bold text-white">{mapRoute.distanceKm ?? '—'} km</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                    <i className="bi bi-mortarboard-fill text-green-400" />
                  </div>
                  <div className="flex-1">
                    <b className="block text-sm text-white">Universidad Politécnica de Aguascalientes</b>
                    <div className="text-xs text-muted">Selecciona una ruta para verla en el mapa</div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ================= Detalle / Reserva ================= */}
        <div className="border-t border-line p-5 lg:overflow-auto lg:border-l lg:border-t-0">
          {selectedTrip ? (
            <>
              <b className="text-base font-extrabold tracking-tight text-white">{selectedTrip.route?.origin}</b>
              <div className="text-xs text-muted mt-1">
                <i className="bi bi-arrow-right mr-1" /> {selectedTrip.route?.destination}
              </div>
              <div className="text-xs text-muted mt-1">
                <i className="bi bi-clock" /> Salida {formatTime(selectedTrip.departureTime)} · ${selectedTrip.cost}
              </div>

              <Card className="mt-3 p-3.5">
                <div className="flex items-center gap-3">
                  <Avatar initial={selectedTrip.driver?.firstName?.[0] ?? 'C'} photoUrl={selectedTrip.driver?.photoUrl} />
                  <div>
                    <b className="text-sm text-white">
                      {selectedTrip.driver?.firstName} {selectedTrip.driver?.lastNamePaternal}
                    </b>
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
              <StopRow label={selectedTrip.route?.origin} time={formatTime(selectedTrip.departureTime)} active />
              <div className="ml-4 border-l-2 border-dashed border-muted/30 h-4" />
              <StopRow label={selectedTrip.route?.destination} time="Destino" />

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
          ) : selectedRoute ? (
            <>
              <b className="text-base font-extrabold tracking-tight text-white">{selectedRoute.origin}</b>
              <div className="text-xs text-muted mt-1">
                <i className="bi bi-arrow-right mr-1" /> {selectedRoute.destination}
              </div>

              <div className="my-3.5 mb-1.5 text-xs font-semibold text-muted">Ruta</div>
              <StopRow label={selectedRoute.origin} time="Salida" active />
              <div className="ml-4 border-l-2 border-dashed border-muted/30 h-4" />
              <StopRow label={selectedRoute.destination} time="Destino" />

              <div className="flex gap-3 mt-3">
                <Card className="flex-1 p-2.5 text-center">
                  <div className="text-lg font-bold text-white">{selectedRoute.distanceKm ?? '—'}</div>
                  <div className="text-[10px] text-muted">km</div>
                </Card>
                <Card className="flex-1 p-2.5 text-center">
                  <div className="text-lg font-bold text-white">{selectedRoute.estimatedMinutes ?? '—'}</div>
                  <div className="text-[10px] text-muted">min</div>
                </Card>
              </div>

              {selectedRoute.description && !selectedRoute.description.includes(',') && (
                <p className="mt-3 text-xs text-muted">{selectedRoute.description}</p>
              )}

              <p className="mt-4 text-xs text-muted">
                <i className="bi bi-info-circle mr-1" />Elige un viaje de esta ruta para reservar tu asiento.
              </p>
            </>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center text-center lg:h-full lg:min-h-0">
              <div>
                <i className="bi bi-signpost-2 text-3xl text-muted block mb-3" />
                <p className="text-sm text-muted">Selecciona una ruta para verla en el mapa</p>
                <p className="text-xs text-muted mt-1">Explora todas las rutas y sus viajes disponibles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
