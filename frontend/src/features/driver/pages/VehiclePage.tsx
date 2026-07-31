import { useState } from 'react';
import { z } from 'zod';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Pill,
  SubPageLayout,
} from '../../../shared/components';
import { useToast } from '../../../shared/toast/ToastProvider';
import { readStoredJSON, removeStoredJSON, writeStoredJSON } from '../../../shared/utils/local-storage';
import { VehicleChangeModal } from '../../vehicles/components/VehicleChangeModal';
import { VehicleFormModal } from '../../vehicles/components/VehicleFormModal';
import { DEFAULT_VEHICLE } from '../../vehicles/demo-data';
import { useVehicles } from '../../vehicles/hooks/useVehicles';
import { vehicleSchema, type VehicleFormValues } from '../../vehicles/schemas/vehicle.schemas';

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-[14px] border border-line bg-surface2 px-4 py-3">
      <div className="text-xs font-semibold text-muted">{label}</div>
      <div className="mt-0.5 text-[15px] font-bold text-white">{value}</div>
    </div>
  );
}

// Solicitud de cambio de vehículo persistida localmente (no existe endpoint en la API).
const changeRequestSchema = z.object({
  vehicle: vehicleSchema,
  documentName: z.string().min(1),
  requestedAt: z.string(),
});

type ChangeRequest = z.infer<typeof changeRequestSchema>;

const CHANGE_REQUEST_KEY = 'rydu_vehicle_change_request';

function readChangeRequest(): ChangeRequest | null {
  const parsed = changeRequestSchema.safeParse(readStoredJSON(CHANGE_REQUEST_KEY));
  return parsed.success ? parsed.data : null;
}

function writeChangeRequest(request: ChangeRequest): void {
  writeStoredJSON(CHANGE_REQUEST_KEY, request);
}

function clearChangeRequest(): void {
  removeStoredJSON(CHANGE_REQUEST_KEY);
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Vista de la opción "Mi vehículo" del perfil del conductor.
// Muestra el vehículo actual y permite solicitar un cambio con comprobante de propiedad.
export function DProfileVehiclePage() {
  const { vehicles, isLoading, error, create } = useVehicles();
  const { showToast } = useToast();

  const [registerOpen, setRegisterOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<ChangeRequest | null>(readChangeRequest);

  // Mientras no exista la API (el fetch falla), se muestra el Ford Aveo Blanco de demostración.
  // Si la API responde vacía, se conserva el flujo de registro de vehículo.
  const vehicle = vehicles[0] ?? (error ? DEFAULT_VEHICLE : null);

  const handleRegister = async (values: VehicleFormValues) => {
    setSubmitting(true);
    try {
      await create(values);
      showToast('Vehículo registrado correctamente.', 'success');
      setRegisterOpen(false);
    } catch (err) {
      showToast(typeof err === 'string' && err ? err : 'No se pudo guardar el vehículo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeSubmit = async (values: VehicleFormValues, documentName: string) => {
    setSubmitting(true);
    try {
      const request: ChangeRequest = { vehicle: values, documentName, requestedAt: new Date().toISOString() };
      writeChangeRequest(request);
      setPendingRequest(request);
      setChangeOpen(false);
      showToast('Solicitud de cambio enviada. Quedará en revisión.', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = () => {
    clearChangeRequest();
    setPendingRequest(null);
    showToast('Solicitud de cambio cancelada.', 'info');
  };

  return (
    <SubPageLayout
      title="Mi vehículo"
      subtitle="El vehículo con el que ofreces tus viajes"
      action={
        !vehicle && !isLoading ? (
          <Button size="sm" onClick={() => setRegisterOpen(true)}>
            <i className="bi bi-plus-lg" /> Registrar
          </Button>
        ) : undefined
      }
    >
      <div className="mt-8">
        {isLoading ? (
          <LoadingState label="Cargando vehículos…" />
        ) : error && !vehicle ? (
          <ErrorState message={error} />
        ) : vehicle ? (
          <div className="flex flex-col gap-4">
            {/* Solicitud pendiente */}
            {pendingRequest && (
              <Card className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#3a2e1b] text-[#e5c07b]">
                    <i className="bi bi-clock-history" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="text-[15px] text-white">Solicitud de cambio en revisión</b>
                    <div className="mt-0.5 text-xs text-muted">
                      {pendingRequest.vehicle.brand} {pendingRequest.vehicle.model} ·{' '}
                      {pendingRequest.vehicle.color} · {pendingRequest.documentName} ·{' '}
                      {formatDate(pendingRequest.requestedAt)}
                    </div>
                  </div>
                  <Pill variant="dark">
                    <i className="bi bi-clock" /> En revisión
                  </Pill>
                  <Button size="sm" variant="ghost" onClick={handleCancelRequest}>
                    Cancelar solicitud
                  </Button>
                </div>
              </Card>
            )}

            {/* Vehículo actual */}
            <Card className="p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-surface2 text-3xl text-white">
                    <i className="bi bi-car-front" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">
                      {vehicle.brand} {vehicle.model}
                    </h2>
                    <p className="text-sm text-muted">
                      {vehicle.color} · {vehicle.year ?? '—'}
                    </p>
                  </div>
                </div>
                {vehicle.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F5] px-[18px] py-2 text-sm font-bold text-black">
                    <i className="bi bi-patch-check-fill" /> Verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface3 px-[18px] py-2 text-sm font-bold text-[#e5e5ea]">
                    <i className="bi bi-clock" /> En revisión
                  </span>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <DetailItem label="Placas" value={vehicle.plates} />
                <DetailItem label="Capacidad" value={`${vehicle.capacity} asientos`} />
                <DetailItem label="Color" value={vehicle.color} />
                <DetailItem label="Año" value={String(vehicle.year ?? '—')} />
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="ghost" onClick={() => setChangeOpen(true)} disabled={Boolean(pendingRequest)}>
                  <i className="bi bi-arrow-repeat" /> Solicitar cambio de vehículo
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <EmptyState
            icon="bi-car-front"
            title="Aún no tienes un vehículo registrado"
            description="Registra tu vehículo para poder publicar rutas como conductor."
            action={
              <Button onClick={() => setRegisterOpen(true)}>
                <i className="bi bi-plus-lg" /> Registrar vehículo
              </Button>
            }
          />
        )}
      </div>

      {/* Registro inicial */}
      <VehicleFormModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        vehicle={null}
        onSubmit={handleRegister}
        isSubmitting={submitting}
      />

      {/* Solicitud de cambio con comprobante de propiedad */}
      <VehicleChangeModal
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
        onSubmit={handleChangeSubmit}
        isSubmitting={submitting}
      />
    </SubPageLayout>
  );
}
