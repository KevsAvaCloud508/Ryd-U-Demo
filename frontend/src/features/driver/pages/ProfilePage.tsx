import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/hooks/useAuth';
import { useRatings } from '../../ratings/hooks/useRatings';
import { useTrips } from '../../trips/hooks/useTrips';
import { useVehicles } from '../../vehicles/hooks/useVehicles';
import { DEFAULT_VEHICLE } from '../../vehicles/demo-data';
import { Avatar, MiniStat, PageHeader } from '../../../shared/components';
import { isDemoSession } from '../../../shared/utils/session';

interface SettingsRowProps {
  icon: string;
  label: string;
  description?: string;
  to: string;
}

function SettingsRow({ icon, label, description, to }: SettingsRowProps) {
  return (
    <Link
      to={to}
      className="flex min-h-[84px] flex-1 items-center gap-5 border-b border-[#353535] px-6 py-5 transition-colors last:border-0 hover:bg-white/[0.04] sm:px-7"
    >
      <div className="grid h-12 w-12 flex-none place-items-center rounded-[14px] bg-surface2">
        <i className={`${icon} text-[26px] text-[#B5B5BA]`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[19px] font-semibold text-white sm:text-[21px]">{label}</div>
        {description && (
          <div className="mt-1.5 text-[14px] leading-snug text-[#8F8F8F] sm:text-[15px]">{description}</div>
        )}
      </div>
      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/[0.04]">
        <i className="bi bi-chevron-right text-xl text-[#8F8F8F]" />
      </div>
    </Link>
  );
}

export function DriverProfilePage() {
  const navigate = useNavigate();
  const isDemo = isDemoSession();

  const { user } = useAuth();
  const { average, loadAverage } = useRatings();
  const { trips, loadMine } = useTrips();
  const { vehicles, isLoading, error } = useVehicles();

  useEffect(() => {
    if (isDemo) return;
    loadAverage();
    loadMine();
  }, [isDemo, loadAverage, loadMine]);

  const handleLogout = () => {
    navigate('/acceso');
  };

  // ── Derivados reales ──
  const completedTrips = trips.filter((t) => t.status === 'Terminado');
  const totalEarnings = completedTrips.reduce((sum, t) => sum + Number(t.cost ?? 0), 0);
  const rating = average?.average?.toFixed(1) ?? '—';

  // Vehículo real del conductor. Si la API no existe (modo demo) se usa el
  // vehículo de demostración para no romper la vista.
  const vehicle = vehicles[0] ?? (error ? DEFAULT_VEHICLE : null);
  const vehicleDescription = isLoading
    ? 'Cargando…'
    : vehicle
      ? `${vehicle.brand} ${vehicle.model} ${vehicle.color}`
      : 'Sin vehículo registrado';

  const settingsRows: SettingsRowProps[] = [
    { icon: 'bi bi-car-front', label: 'Mi vehículo', description: vehicleDescription, to: '/conductor/perfil/vehiculo' },
    { icon: 'bi bi-file-text', label: 'Documentos', description: 'Verificación y comprobantes', to: '/conductor/perfil/documentos' },
    { icon: 'bi bi-bank', label: 'Cuenta para cobros', description: 'Banco y CLABE para recibir pagos', to: '/conductor/perfil/cuenta' },
    { icon: 'bi bi-bell', label: 'Notificaciones', description: 'Avisos y preferencias de contacto', to: '/conductor/perfil/notificaciones' },
    { icon: 'bi bi-shield-check', label: 'Seguridad', description: 'Contraseña, sesiones y privacidad', to: '/conductor/perfil/seguridad' },
  ];

  const fullName = user?.fullName ?? 'Juan Ángel de la Torre';
  const initial = fullName[0] ?? 'J';
  const academicLine = isDemo ? 'Ing. Sistemas · 6to Semestre' : 'Conductor RydU · UPA';
  const earningsDisplay = totalEarnings >= 1000 ? `$${(totalEarnings / 1000).toFixed(1)}k` : `$${totalEarnings}`;

  return (
    <div className="px-4 pb-10 sm:px-6 lg:px-10">
      {/* Header */}
      <PageHeader title="Perfil" subtitle="Tu información personal y configuración" />

      {/* Two-column layout */}
      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-[30px]">
        {/* Left — Profile card (40%) */}
        <div className="flex w-full flex-col items-center rounded-[24px] border border-[#353535] bg-[#222222] px-6 py-9 sm:px-9 lg:w-[40%]">
          <Avatar initial={initial} size={104} variant="solid" />

          {/* Name */}
          <h2 className="mt-4 text-center text-3xl font-extrabold leading-tight text-white sm:text-[40px]">
            {fullName}
          </h2>

          {/* Academic info */}
          <p className="mt-1 text-[18px] font-medium text-[#9A9A9A]">{academicLine}</p>

          {/* Verified badge */}
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-[#F5F5F5] px-[18px] py-2 text-sm font-bold text-black">
            <i className="bi bi-shield-check" />
            Conductor verificado
          </div>

          {/* Stats */}
          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:gap-[14px]">
            {isDemo ? (
              <>
                <MiniStat value="4.8" label="Rating" />
                <MiniStat value="86" label="Viajes" />
                <MiniStat value="$5.2k" label="Ganado" />
              </>
            ) : (
              <>
                <MiniStat value={rating} label="Rating" />
                <MiniStat value={String(completedTrips.length)} label="Viajes" />
                <MiniStat value={earningsDisplay} label="Ganado" />
              </>
            )}
          </div>
        </div>

        {/* Right — Settings panel (60%) */}
        <div className="flex w-full flex-col lg:w-[60%]">
          {/* El panel crece hasta igualar la altura de la tarjeta de perfil */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-[22px] border border-[#353535] bg-[#222222]">
            {settingsRows.map((row) => (
              <SettingsRow key={row.label} {...row} />
            ))}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-6 flex w-fit items-center gap-3 rounded-full border border-[#454545] bg-[#303030] px-[26px] py-4 text-[18px] font-bold text-white transition-colors hover:bg-[#3a3a3a]"
          >
            <i className="bi bi-box-arrow-right text-lg" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
