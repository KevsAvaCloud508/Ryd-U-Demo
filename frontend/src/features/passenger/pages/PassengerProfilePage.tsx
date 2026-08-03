import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, ListRow, Navbar, Pill } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { ProfileEditModal } from '../../auth/components/ProfileEditModal';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDocuments } from '../../documents/hooks/useDocuments';
import { useRatings } from '../../ratings/hooks/useRatings';

// Vista P6 · Perfil: cuenta del pasajero y ajustes
export function PassengerProfilePage() {
  const { user, logout } = useAuth();
  const { average, loadAverage } = useRatings();
  const { documents, load: loadDocs } = useDocuments();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => { loadAverage(); loadDocs(); }, [loadAverage, loadDocs]);

  // Determina el estado general de los documentos
  const getDocStatusLabel = (): { text: string; color: string } => {
    if (documents.length === 0) return { text: 'Sin documentos', color: 'text-muted' };
    const allAccepted = documents.every((d) => d.status === 'Aceptado');
    if (allAccepted) return { text: 'Aprobados', color: 'text-white' };
    const anyRejected = documents.some((d) => d.status === 'Rechazado');
    if (anyRejected) return { text: 'Rechazados', color: 'text-red-400' };
    return { text: 'En revisión', color: 'text-yellow-400' };
  };
  const docStatus = getDocStatusLabel();

  // Valores numéricos protegidos (el backend puede devolverlos como null/string).
  const rating = Number(average?.average ?? 0).toFixed(1);
  const tripsCount = Number(average?.count ?? 0);
  const savings = `$${(tripsCount * 50).toFixed(0)}`;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      <Navbar
        links={[
          { label: 'Inicio', href: '/pasajero/inicio' },
          { label: 'Buscar', href: '/pasajero/buscar' },
          { label: 'Actividad', href: '/pasajero/actividad' },
          { label: 'Perfil', href: '/pasajero/perfil', active: true },
        ]}
        right={
          <>
            <Pill variant="dark"><i className="bi bi-person-walking" /> Pasajero</Pill>
            <NotificationBell />
            <Avatar initial={user?.firstName?.[0] ?? 'U'} photoUrl={user?.photoUrl} onClick={() => setEditModalOpen(true)} />
          </>
        }
      />
      <div className="grid grid-cols-1 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[340px_1fr] lg:px-12">
        <Card className="h-fit p-7 text-center">
          <Avatar initial={user?.firstName?.[0] ?? 'U'} size={84} photoUrl={user?.photoUrl} className="mx-auto text-3xl" onClick={() => setEditModalOpen(true)} />
          <b className="mt-3.5 block text-xl text-white">{user?.fullName ?? 'Usuario'}</b>
          <div className="text-[13px] text-muted">{user?.email}</div>
          <Pill variant="dark" className="mt-3">
            <i className="bi bi-patch-check-fill" /> Estudiante verificado
          </Pill>
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <Card className="flex-1 p-3">
              <b className="text-lg text-white">{rating}</b>
              <div className="text-[11px] text-muted">Rating</div>
            </Card>
            <Card className="flex-1 p-3">
              <b className="text-lg text-white">{tripsCount}</b>
              <div className="text-[11px] text-muted">Viajes</div>
            </Card>
            <Card className="flex-1 p-3">
              <b className="text-lg text-white">{savings}</b>
              <div className="text-[11px] text-muted">Ahorro</div>
            </Card>
          </div>
        </Card>

        <div>
          <b className="text-lg font-extrabold tracking-tight text-white">Configuración de la cuenta</b>
          <Card className="mt-3.5 p-0">
            <ListRow icon={<i className="bi bi-pencil" />} label="Editar perfil" onClick={() => setEditModalOpen(true)} />
            <div className="h-px bg-line" />
            <ListRow icon={<i className="bi bi-credit-card" />} label="Métodos de pago" />
            <div className="h-px bg-line" />
            <ListRow icon={<i className="bi bi-bell" />} label="Notificaciones" />
            <div className="h-px bg-line" />
            <ListRow icon={<i className="bi bi-shield-lock" />} label="Seguridad y privacidad" />
            <div className="h-px bg-line" />
            <ListRow
              icon={<i className="bi bi-file-earmark-check" />}
              label={
                <>
                  Documentos <span className={docStatus.color}>· {docStatus.text}</span>
                </>
              }
              onClick={() => navigate('/pasajero/validacion')}
            />
            <div className="h-px bg-line" />
            <ListRow icon={<i className="bi bi-question-circle" />} label="Ayuda y soporte" />
          </Card>
          <Button variant="dark" className="mt-4" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" /> Cerrar sesión
          </Button>
        </div>
      </div>

      <ProfileEditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} />
    </div>
  );
}
