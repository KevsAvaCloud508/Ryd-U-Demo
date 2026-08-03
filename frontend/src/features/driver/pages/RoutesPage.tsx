import { useCallback, useEffect, useState } from 'react';

import { useToast } from '../../../shared/toast/ToastProvider';
import { useTrips } from '../../trips/hooks/useTrips';
import { createRoute } from '../../trips/services/routes.service';
import { useVehicles } from '../../vehicles/hooks/useVehicles';
import { Button, IconInput, PageHeader } from '../../../shared/components';
import { isDemoSession } from '../../../shared/utils/session';
import type { Trip } from '../../trips/types/trips.types';

const STORAGE_KEY = 'rydu_driver_routes';
const VERSION_KEY = 'rydu_driver_routes_v';
const DATA_VERSION = 2;

type RoutesTab = 'actuales' | 'publicar';

const filterTabs: { key: RoutesTab; label: string }[] = [
  { key: 'actuales', label: 'Rutas actuales' },
  { key: 'publicar', label: 'Publicar ruta' },
];

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;
const DEFAULT_DAYS = new Set([0, 1, 2, 3, 4]);

interface PublishedRoute {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: string;
  price: string;
  days: string;
  createdAt: string;
}

const DEFAULT_ROUTES: PublishedRoute[] = [
  { id: 'route-1', origin: 'Colonia del Valle', destination: 'UPA', date: '2026-07-29', time: '6:45', seats: '4', price: '$45', days: 'L, M, M, J, V', createdAt: '28 jul, 2026' },
  { id: 'route-2', origin: 'Fracc. San Ángel', destination: 'UPA', date: '2026-07-29', time: '7:30', seats: '3', price: '$50', days: 'L, M, M, J, V', createdAt: '27 jul, 2026' },
  { id: 'route-3', origin: 'Las Lomas', destination: 'UPA', date: '2026-07-29', time: '9:00', seats: '4', price: '$35', days: 'L, M, M, J, V', createdAt: '26 jul, 2026' },
  { id: 'route-4', origin: 'Haciendas del Valle', destination: 'UPA', date: '2026-07-29', time: '12:30', seats: '4', price: '$40', days: 'L, M, M, J, V', createdAt: '25 jul, 2026' },
];

function loadRoutes(): PublishedRoute[] {
  try {
    // Si cambió la versión de datos, limpiar y usar defaults nuevos
    const savedVersion = localStorage.getItem(VERSION_KEY);
    if (savedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PublishedRoute[];
      if (parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  // Primera carga o datos desactualizados: sembrar rutas nuevas
  saveRoutes(DEFAULT_ROUTES);
  localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  return DEFAULT_ROUTES;
}

function saveRoutes(routes: PublishedRoute[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

// Convierte un viaje real en la tarjeta de ruta que usa la UI.
function toPublishedRoute(trip: Trip): PublishedRoute {
  return {
    id: trip.id,
    origin: trip.route?.origin ?? '—',
    destination: trip.route?.destination ?? '—',
    date: trip.date,
    time: trip.departureTime?.slice(0, 5) ?? '—',
    seats: String(trip.availableSeats ?? 0),
    price: `$${trip.cost ?? 0}`,
    days: '',
    createdAt: trip.date ? new Date(trip.date).toLocaleDateString('es-MX') : '—',
  };
}

export function DriverRoutesPage() {
  const isDemo = isDemoSession();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<RoutesTab>('actuales');
  const [routes, setRoutes] = useState<PublishedRoute[]>(loadRoutes);

  // ── Datos reales ──
  const { trips, loadMine, create: createTrip } = useTrips();
  const { vehicles } = useVehicles();

  useEffect(() => {
    if (isDemo) return;
    loadMine();
  }, [isDemo, loadMine]);

  // Solo rutas activas (Pendiente/EnProceso): las terminadas pertenecen al historial.
  const realRoutes: PublishedRoute[] = trips
    .filter((t) => t.status === 'Pendiente' || t.status === 'EnProceso')
    .map(toPublishedRoute);

  // Publicar ruta form state
  const [origin, setOrigin] = useState('');
  const [destination] = useState('Universidad Politécnica (UPA)');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats] = useState('4');
  const [price] = useState('$50');
  const [selectedDays, setSelectedDays] = useState<Set<number>>(DEFAULT_DAYS);
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleDay = (index: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handlePublish = useCallback(async () => {
    if (!origin.trim() || !date || !time) return;

    if (isDemo) {
      const dayLabels = Array.from(selectedDays)
        .sort()
        .map((i) => DAYS[i])
        .join(', ');

      setRoutes((prev) => {
        const maxId = prev.reduce(
          (max, r) => Math.max(max, parseInt(r.id.replace('route-', ''), 10) || 0),
          0,
        ) + 1;

        const newRoute: PublishedRoute = {
          id: `route-${maxId}`,
          origin: origin.trim(),
          destination,
          date,
          time,
          seats,
          price,
          days: dayLabels,
          createdAt: new Date().toLocaleString('es-MX'),
        };

        const updated = [newRoute, ...prev];
        saveRoutes(updated);
        return updated;
      });
      setOrigin('');
      setDate('');
      setTime('');
      setSelectedDays(DEFAULT_DAYS);
      setActiveTab('actuales');
      return;
    }

    // ── Modo real: crear ruta + viaje en la API ──
    if (vehicles.length === 0) {
      showToast('Registra un vehículo antes de publicar una ruta.', 'error');
      return;
    }
    setIsPublishing(true);
    try {
      const route = await createRoute({ origin: origin.trim(), destination });
      const cost = parseInt(price.replace(/[^0-9]/g, ''), 10) || undefined;
      await createTrip({
        vehicleId: vehicles[0].id,
        routeId: route.id,
        date,
        departureTime: time,
        availableSeats: parseInt(seats, 10) || 4,
        cost,
      });
      showToast('Ruta publicada correctamente.', 'success');
      await loadMine();
      setOrigin('');
      setDate('');
      setTime('');
      setSelectedDays(DEFAULT_DAYS);
      setActiveTab('actuales');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo publicar la ruta.', 'error');
    } finally {
      setIsPublishing(false);
    }
  }, [isDemo, origin, destination, date, time, seats, price, selectedDays, vehicles, createRoute, createTrip, loadMine, showToast]);

  // Sincronizar cambios hechos desde otra pestaña (solo demo)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setRoutes(loadRoutes());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const dayLabels = Array.from(selectedDays)
    .sort()
    .map((i) => DAYS[i])
    .join(', ');

  const displayRoutes = isDemo ? routes : realRoutes;

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex flex-1 flex-col px-4 pb-10 pt-[30px] sm:px-6 lg:px-10 lg:pt-[38px]">
        <PageHeader title="Rutas" subtitle="Gestiona y publica tus rutas de viaje" />

        {/* Filter tabs */}
        <div className="mt-8 flex w-full gap-2 overflow-x-auto rounded-[18px] bg-[#1A1A1A] p-1.5 sm:w-fit">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-[14px] px-6 py-2.5 text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-black'
                  : 'text-[#8C8C8C] hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================================================================
            TAB: RUTAS ACTUALES
            ================================================================ */}
        {activeTab === 'actuales' && (
          <div className="mt-6">
            {displayRoutes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#353535] py-20">
                <i className="bi bi-archive text-5xl text-[#4A4A4A]" />
                <p className="mt-4 text-lg font-medium text-[#6B6B6B]">
                  No tienes rutas publicadas todavía
                </p>
                <p className="mt-1 text-sm text-[#5A5A5A]">
                  Publica una ruta para que los pasajeros puedan solicitarla.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('publicar')}
                  className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  Publicar primera ruta
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {displayRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="rounded-[20px] border border-[#353535] bg-[#1F1F1F] p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                          <i className="bi bi-car-front text-lg text-white" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-white">
                            {route.origin} → {route.destination}
                          </p>
                          <p className="text-xs text-[#8F8F8F]">Publicada {route.createdAt}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white">
                        Activa
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-black/30 p-3">
                      <div className="text-center">
                        <p className="text-[11px] text-[#8F8F8F]">Horario</p>
                        <p className="text-sm font-bold text-white">{route.time}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] text-[#8F8F8F]">Asientos</p>
                        <p className="text-sm font-bold text-white">{route.seats}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] text-[#8F8F8F]">Precio</p>
                        <p className="text-sm font-bold text-white">{route.price}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-[#8F8F8F]">
                      <i className="bi bi-calendar3" />
                      <span>
                        {route.date ? new Date(route.date).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }) : '—'}
                      </span>
                      {route.days && (
                        <>
                          <span className="text-[#4A4A4A]">·</span>
                          <i className="bi bi-arrow-repeat" />
                          <span>{route.days}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================
            TAB: PUBLICAR RUTA
            ================================================================ */}
        {activeTab === 'publicar' && (
          <div className="mt-10">
            <div className="grid max-w-[680px] grid-cols-1 gap-x-5 gap-y-[18px] sm:grid-cols-2">
              <IconInput
                icon="bi bi-circle"
                label="Origen"
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ej: Bosques del Prado"
              />

              <IconInput
                icon="bi bi-geo-alt"
                label="Destino"
                type="text"
                value={destination}
                readOnly
              />

              <IconInput
                icon="bi bi-calendar3"
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="[&::-webkit-calendar-picker-indicator]:invert"
              />

              <IconInput
                icon="bi bi-clock"
                label="Hora de salida"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="[&::-webkit-calendar-picker-indicator]:invert"
              />

              <IconInput
                icon="bi bi-people"
                label="Asientos disponibles"
                type="text"
                value={seats}
                readOnly
              />

              <IconInput
                icon="bi bi-wallet2"
                label="Precio por asiento"
                type="text"
                value={price}
                readOnly
              />
            </div>

            {/* Días recurrentes */}
            <div className="mt-8">
              <label className="text-[16px] font-semibold text-[#A0A0A0]">Días recurrentes</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {DAYS.map((day, index) => {
                  const isSelected = selectedDays.has(index);
                  return (
                    <button
                      key={`${day}-${index}`}
                      type="button"
                      onClick={() => toggleDay(index)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-all ${
                        isSelected
                          ? 'bg-white text-black'
                          : 'border border-[#353535] bg-transparent text-[#6B6B6B] hover:border-white/50 hover:text-white/70'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              {selectedDays.size > 0 && (
                <p className="mt-2 text-sm text-[#8F8F8F]">
                  <i className="bi bi-arrow-repeat mr-1" />
                  Se repite: {dayLabels}
                </p>
              )}
            </div>

            {/* Publish button */}
            <div className="mt-10">
              <Button
                onClick={handlePublish}
                disabled={!origin.trim() || !date || !time || isPublishing}
                className="rounded-full bg-white px-10 py-4 text-xl font-bold text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPublishing ? 'Publicando…' : 'Publicar ruta'}
                <i className="bi bi-arrow-right ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
