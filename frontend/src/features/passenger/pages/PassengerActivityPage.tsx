import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, DataTable, Navbar, Pill, RatingModal, Segmented, StatCard } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { useToast } from '../../../shared/toast/ToastProvider';
import { useRequests } from '../../requests/hooks/useRequests';
import { useRatings } from '../../ratings/hooks/useRatings';
import { usePassengerStats } from '../hooks/usePassengerStats';
import { formatTime } from '../../../shared/utils/format-time';
import { formatDate } from '../../../shared/utils/format-date';
import { isDemoSession } from '../../../shared/utils/session';
import { DEMO_HISTORY_REQUESTS } from '../../trips/demo-data';
import type { TripRequest } from '../../requests/types/requests.types';

const TODAY = new Date().toISOString().slice(0, 10);

// Misma lógica de estado que Inicio: aceptada y pasada = Completado,
// aceptada futura = Confirmado, pendiente futura = Solicitado.
// 'Completado' solo cuando la solicitud fue Aceptado EN UN VIAJE PASADO,
// exactamente igual que usePassengerStats (así la tabla siempre cuadra con
// "Viajes totales").
const statusLabel = (req: TripRequest): 'Completado' | 'Confirmado' | 'Solicitado' | 'Rechazado' | 'Cancelado' => {
  const past = req.trip.date.slice(0, 10) < TODAY;
  if (req.status === 'Rechazado') return 'Rechazado';
  if (req.status === 'Cancelado') return 'Cancelado';
  if (req.status === 'Aceptado') return past ? 'Completado' : 'Confirmado';
  return 'Solicitado';
};

// Vista P5 · Actividad: historial de viajes realizados, próximos y calificaciones.
// El historial muestra SOLO los viajes completados (los que cuentan en
// "Viajes totales"); los próximos y los no concretados van en secciones aparte.
export function PassengerActivityPage() {
  const navigate = useNavigate();
  const isDemo = isDemoSession();
  const { requests, loadMine } = useRequests();
  const { ratings, loadMine: loadRatings, loadAverage, submit } = useRatings();
  const { tripsCount, savings, rating } = usePassengerStats();
  const { showToast } = useToast();
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<{ tripId: string; rateeId: string; driverName: string } | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    // En modo demo no hay API: se usan las solicitudes simuladas.
    if (isDemo) return;
    loadMine();
    loadRatings();
    loadAverage();
  }, [isDemo, loadMine, loadRatings, loadAverage]);

  const byDate = (a: TripRequest, b: TripRequest) => a.trip.date.slice(0, 10).localeCompare(b.trip.date.slice(0, 10));

  // En modo demo se muestran las solicitudes simuladas (3 realizadas + 2 próximas)
  // para que el historial no quede vacío y cuadre con "Viajes totales".
  const requestsSource = isDemo ? DEMO_HISTORY_REQUESTS : requests;

  // Viajes ya realizados (los que concuerdan con "Viajes totales"), más reciente primero.
  const completedTrips = requestsSource
    .filter((r) => statusLabel(r) === 'Completado')
    .sort((a, b) => byDate(b, a));
  // Pre-reservas y solicitudes futuras (Confirmado / Solicitado), más cercano primero.
  const upcomingTrips = requestsSource
    .filter((r) => statusLabel(r) === 'Confirmado' || statusLabel(r) === 'Solicitado')
    .sort(byDate);
  // Solicitudes que no se concretaron (Rechazado / Cancelado), más reciente primero.
  const declinedTrips = requestsSource
    .filter((r) => statusLabel(r) === 'Rechazado' || statusLabel(r) === 'Cancelado')
    .sort((a, b) => byDate(b, a));

  const openRatingModal = (tripId: string, rateeId: string, driverName: string) => {
    setSelectedTrip({ tripId, rateeId, driverName });
    setRatingModalOpen(true);
  };

  const handleSubmitRating = async (score: number) => {
    if (!selectedTrip) return;
    setIsSubmittingRating(true);
    try {
      await submit({ tripId: selectedTrip.tripId, rateeId: selectedTrip.rateeId, score });
      showToast('Calificacion enviada.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al calificar.', 'error');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Celdas base (fecha, hora, ruta, conductor) compartidas entre tablas.
  const baseCells = (req: TripRequest): ReactNode[] => [
    req.trip?.date ? formatDate(req.trip.date) : '—',
    formatTime(req.trip?.departureTime),
    `${req.trip?.route?.origin ?? '—'} → ${req.trip?.route?.destination ?? '—'}`,
    req.trip?.driver?.firstName ?? '—',
  ];

  const statusPill = (req: TripRequest) => (
    <Pill key={req.id} variant={statusLabel(req) === 'Completado' || statusLabel(req) === 'Confirmado' ? 'dark' : 'outline'}>
      {statusLabel(req)}
    </Pill>
  );

  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      <Navbar
        links={[
          { label: 'Inicio', href: '/pasajero/inicio' },
          { label: 'Buscar', href: '/pasajero/buscar' },
          { label: 'Actividad', href: '/pasajero/actividad', active: true },
          { label: 'Perfil', href: '/pasajero/perfil' },
        ]}
        right={
          <>
            <Pill variant="dark"><i className="bi bi-person-walking" /> Pasajero</Pill>
            <NotificationBell />
            <Avatar initial="E" onClick={() => navigate('/pasajero/perfil')} />
          </>
        }
      />
      <div className="px-4 py-[30px] sm:px-8 lg:px-12">
        {/* Modal de calificacion */}
        <RatingModal
          open={ratingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          onSubmit={handleSubmitRating}
          userName={selectedTrip?.driverName ?? 'Conductor'}
          isSubmitting={isSubmittingRating}
        />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Actividad</h2>
            <p className="mt-1 text-sm text-muted">Tu historial de viajes</p>
          </div>
          <div className="w-full overflow-x-auto lg:w-auto">
            <Segmented activeIndex={0} options={[{ label: 'Historial' }, { label: 'Calificaciones' }]} onSelect={() => {}} />
          </div>
        </div>

        <div className="my-[22px] grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon="bi bi-clock-history" label="Viajes totales" value={String(tripsCount)} />
          <StatCard icon="bi bi-piggy-bank" label="Ahorro estimado" value={`$${savings}`} />
          <StatCard icon="bi bi-star" label="Calificación media" value={rating ?? '—'} />
        </div>

        {/* Historial: solo viajes completados (concuerda con Viajes totales) */}
        <Card>
          <div className="flex items-center justify-between px-[18px] py-4">
            <b className="text-white">Historial de viajes</b>
            <Pill variant="dark">{completedTrips.length} viaje{completedTrips.length === 1 ? '' : 's'} realizado{completedTrips.length === 1 ? '' : 's'}</Pill>
          </div>
          {requestsSource.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <i className="bi bi-clock-history text-4xl text-muted block mb-3" />
              <p className="text-muted">Todavía no tienes viajes</p>
              <p className="text-xs text-muted mt-1">Reserva un asiento para verlo aquí</p>
            </div>
          ) : completedTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <i className="bi bi-suitcase-lg text-4xl text-muted block mb-3" />
              <p className="text-muted">Aún no has realizado viajes</p>
              <p className="text-xs text-muted mt-1">Tus viajes completados aparecerán aquí</p>
            </div>
          ) : (
            <DataTable
              columns={[
                { label: 'Fecha' },
                { label: 'Hora' },
                { label: 'Ruta' },
                { label: 'Conductor' },
                { label: 'Calificación' },
                { label: 'Estado' },
                { label: 'Costo', align: 'right' },
                { label: '', align: 'right' },
              ]}
              rows={completedTrips.map((req) => [
                ...baseCells(req),
                <span key={req.id} className="text-xs text-white">
                  {ratings.find((r) => r.tripId === req.tripId) ? (
                    <>{Array(ratings.find((r) => r.tripId === req.tripId)!.score).fill(null).map((_, i) => <i key={i} className="bi bi-star-fill" />)}</>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </span>,
                statusPill(req),
                <b key={req.id} className="text-white">${req.trip?.cost ?? '—'}</b>,
                !ratings.find((r) => r.tripId === req.tripId) ? (
                  <Button
                    key={req.id}
                    size="sm"
                    onClick={() => openRatingModal(
                      req.tripId,
                      req.trip?.driver?.id ?? '',
                      req.trip?.driver?.firstName ?? 'Conductor',
                    )}
                  >
                    Calificar
                  </Button>
                ) : (
                  <span key={req.id} className="text-muted">—</span>
                ),
              ])}
            />
          )}
        </Card>

        {/* Próximos viajes (pre-reservas y solicitudes pendientes) */}
        {upcomingTrips.length > 0 && (
          <Card className="mt-4">
            <div className="flex items-center justify-between px-[18px] py-4">
              <b className="text-white">Próximos viajes</b>
              <Pill variant="outline">{upcomingTrips.length} pendiente{upcomingTrips.length === 1 ? '' : 's'}</Pill>
            </div>
            <DataTable
              columns={[
                { label: 'Fecha' },
                { label: 'Hora' },
                { label: 'Ruta' },
                { label: 'Conductor' },
                { label: 'Estado' },
                { label: 'Costo', align: 'right' },
              ]}
              rows={upcomingTrips.map((req) => [
                ...baseCells(req),
                statusPill(req),
                <b key={req.id} className="text-white">${req.trip?.cost ?? '—'}</b>,
              ])}
            />
          </Card>
        )}

        {/* Solicitudes no concretadas */}
        {declinedTrips.length > 0 && (
          <Card className="mt-4">
            <div className="flex items-center justify-between px-[18px] py-4">
              <b className="text-white">No concretadas</b>
              <Pill variant="outline">{declinedTrips.length}</Pill>
            </div>
            <DataTable
              columns={[
                { label: 'Fecha' },
                { label: 'Hora' },
                { label: 'Ruta' },
                { label: 'Conductor' },
                { label: 'Estado' },
                { label: 'Costo', align: 'right' },
              ]}
              rows={declinedTrips.map((req) => [
                ...baseCells(req),
                statusPill(req),
                <b key={req.id} className="text-white">${req.trip?.cost ?? '—'}</b>,
              ])}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
