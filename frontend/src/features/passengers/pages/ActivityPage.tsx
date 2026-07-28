import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, DataTable, Navbar, Pill, RatingModal, Segmented, StatCard } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { useToast } from '../../../shared/toast/ToastProvider';
import { useRequests } from '../../requests/hooks/useRequests';
import { useRatings } from '../../ratings/hooks/useRatings';

// Vista P5 · Actividad: historial de viajes y calificaciones del pasajero
export function PassengerActivityPage() {
  const navigate = useNavigate();
  const { requests, loadMine } = useRequests();
  const { ratings, average, loadMine: loadRatings, loadAverage, submit } = useRatings();
  const { showToast } = useToast();
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<{ tripId: string; rateeId: string; driverName: string } | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    loadMine();
    loadRatings();
    loadAverage();
  }, [loadMine, loadRatings, loadAverage]);

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
      <div className="px-12 py-[30px]">
        {/* Modal de calificacion */}
        <RatingModal
          open={ratingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          onSubmit={handleSubmitRating}
          userName={selectedTrip?.driverName ?? 'Conductor'}
          isSubmitting={isSubmittingRating}
        />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Actividad</h2>
            <p className="mt-1 text-sm text-muted">Tu historial de viajes</p>
          </div>
          <Segmented activeIndex={0} options={[{ label: 'Historial' }, { label: 'Calificaciones' }]} />
        </div>

        <div className="my-[22px] grid grid-cols-3 gap-4">
          <StatCard icon={<i className="bi bi-clock-history" />} label="Viajes totales" value={requests.length} />
          <StatCard icon={<i className="bi bi-piggy-bank" />} label="Ahorro estimado" value={`$${requests.length * 50}`} />
          <StatCard icon={<i className="bi bi-star" />} label="Calificación media" value={average?.average?.toFixed(1) ?? '—'} />
        </div>

        <Card>
          <div className="flex items-center justify-between px-[18px] py-4">
            <b className="text-white">Historial de viajes</b>
            <Pill variant="dark">Pasajero</Pill>
          </div>
          <DataTable
            columns={[
              { label: 'Fecha' },
              { label: 'Ruta' },
              { label: 'Conductor' },
              { label: 'Calificación' },
              { label: 'Estado' },
              { label: 'Costo', align: 'right' },
            ]}
            rows={requests.map((req) => [
              req.requestedAt
                ? new Date(req.requestedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
                : '—',
              `${req.trip?.route?.origin ?? '—'} → ${req.trip?.route?.destination ?? '—'}`,
              req.trip?.driver?.firstName ?? '—',
              <span key={req.id} className="text-xs text-white">
                {ratings.find((r) => r.tripId === req.tripId) ? (
                  <>{Array(ratings.find((r) => r.tripId === req.tripId)!.score).fill(null).map((_, i) => <i key={i} className="bi bi-star-fill" />)}</>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </span>,
              <Pill key={req.id} variant={req.status === 'Aceptado' ? 'dark' : 'outline'}>
                {req.status === 'Aceptado' ? 'Completado' : req.status === 'Cancelado' ? 'Cancelado' : 'Pendiente'}
              </Pill>,
              <b key={req.id} className="text-white">${req.trip?.cost ?? '—'}</b>,
              req.status === 'Aceptado' && !ratings.find((r) => r.tripId === req.tripId) ? (
                <Button
                  key={req.id}
                  size="sm"
                  onClick={() => openRatingModal(
                    req.tripId,
                    req.trip?.driver?.id ?? '',
                    req.trip?.driver?.firstName ?? 'Conductor'
                  )}
                >
                  Calificar
                </Button>
              ) : (
                <span key={req.id} className="text-muted">—</span>
              ),
            ])}
          />
        </Card>
      </div>
    </div>
  );
}
