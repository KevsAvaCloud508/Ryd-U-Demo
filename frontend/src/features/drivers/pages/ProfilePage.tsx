import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Divider, ListRow, Pill } from '../../../shared/components';
import { useToast } from '../../../shared/toast/ToastProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDocuments } from '../../documents/hooks/useDocuments';
import { ProfileEditModal } from '../../auth/components/ProfileEditModal';
import { VehicleFormModal } from '../../vehicles/components/VehicleFormModal';
import { useVehicles } from '../../vehicles/hooks/useVehicles';
import type { Vehicle } from '../../vehicles/types/vehicle.types';
import { DriverSidebar } from '../components/DriverSidebar';

// Vista C6 · Perfil: cuenta del conductor, vehículos y documentos
export function DriverProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { vehicles, isLoading, create, update, remove } = useVehicles();
  const { documents, load: loadDocs } = useDocuments();

  useEffect(() => { loadDocs(); }, [loadDocs]);

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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Parameters<typeof create>[0]) => {
    setIsSubmitting(true);
    try {
      if (editingVehicle) {
        await update(editingVehicle.id, values);
        showToast('Vehículo actualizado correctamente.', 'success');
      } else {
        await create(values);
        showToast('Vehículo registrado correctamente.', 'success');
      }
      setModalOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo guardar el vehículo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    try {
      await remove(vehicle.id);
      showToast('Vehículo eliminado.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo eliminar el vehículo.', 'error');
    }
  };

  return (
    <div className="grid min-h-screen bg-black text-[#e5e7eb]" style={{ gridTemplateColumns: '210px 1fr' }}>
      <DriverSidebar active="perfil" />
      <div className="grid gap-6 p-8" style={{ gridTemplateColumns: '340px 1fr' }}>
        <Card className="h-fit p-7 text-center">
          <Avatar initial={user?.firstName?.[0] ?? 'C'} size={84} photoUrl={user?.photoUrl} className="mx-auto text-3xl" onClick={() => setProfileModalOpen(true)} />
          <b className="mt-3.5 block text-xl text-white">{user?.fullName ?? 'Conductor'}</b>
          <div className="text-[13px] text-muted">{user?.email}</div>
          <Pill variant="white" className="mt-3">
            <i className="bi bi-patch-check-fill" /> Conductor verificado
          </Pill>
          <div className="mt-5 flex gap-2.5">
            <Card className="flex-1 p-3">
              <b className="text-lg text-white">4.8</b>
              <div className="text-[11px] text-muted">Rating</div>
            </Card>
            <Card className="flex-1 p-3">
              <b className="text-lg text-white">86</b>
              <div className="text-[11px] text-muted">Viajes</div>
            </Card>
            <Card className="flex-1 p-3">
              <b className="text-lg text-white">$5.2k</b>
              <div className="text-[11px] text-muted">Ganado</div>
            </Card>
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between">
            <b className="text-lg font-extrabold tracking-tight text-white">Mis vehículos</b>
            <Button size="sm" onClick={openCreateModal}>
              <i className="bi bi-plus-lg" /> Agregar
            </Button>
          </div>

          <Card className="mt-3.5 p-0">
            {isLoading && <div className="px-4 py-3.5 text-sm text-muted">Cargando vehículos…</div>}
            {!isLoading && vehicles.length === 0 && (
              <div className="px-4 py-3.5 text-sm text-muted">Aún no has registrado ningún vehículo.</div>
            )}
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.id}>
                {index > 0 && <Divider />}
                <ListRow
                  icon={<i className="bi bi-car-front-fill" />}
                  label={
                    <span>
                      {vehicle.brand} {vehicle.model} · {vehicle.color}{' '}
                      <span className="text-muted">({vehicle.plates})</span>
                    </span>
                  }
                  trailing={
                    <span className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(vehicle)}
                        aria-label="Editar vehículo"
                        className="text-muted hover:text-white"
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(vehicle)}
                        aria-label="Eliminar vehículo"
                        className="text-muted hover:text-red-400"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </span>
                  }
                />
              </div>
            ))}
          </Card>

          <b className="mt-6 block text-lg font-extrabold tracking-tight text-white">Cuenta</b>
          <Card className="mt-3.5 p-0">
            <ListRow
              icon={<i className="bi bi-pencil" />}
              label="Editar perfil"
              onClick={() => setProfileModalOpen(true)}
            />
            <Divider />
            <ListRow
              icon={<i className="bi bi-file-earmark-check" />}
              label={<>
                Documentos <span className={docStatus.color}>· {docStatus.text}</span>
              </>}
              onClick={() => navigate('/conductor/validacion')}
            />
            <Divider />
            <ListRow icon={<i className="bi bi-bank" />} label="Cuenta para cobros" />
            <Divider />
            <ListRow icon={<i className="bi bi-bell" />} label="Notificaciones" />
            <Divider />
            <ListRow icon={<i className="bi bi-shield-lock" />} label="Seguridad y privacidad" />
          </Card>
          <Button variant="dark" className="mt-4" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" /> Cerrar sesión
          </Button>
        </div>
      </div>

      <VehicleFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        vehicle={editingVehicle}
        isSubmitting={isSubmitting}
      />

      <ProfileEditModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
}
