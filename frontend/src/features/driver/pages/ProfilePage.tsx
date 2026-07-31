import { Link, useNavigate } from 'react-router-dom';

import { Avatar, MiniStat, PageHeader } from '../../../shared/components';
import { DEFAULT_VEHICLE } from '../../vehicles/demo-data';
import { useVehicles } from '../../vehicles/hooks/useVehicles';

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
      className="flex min-h-[84px] flex-1 items-center gap-5 border-b border-[#353535] px-7 py-5 transition-colors last:border-0 hover:bg-white/[0.04]"
    >
      <div className="grid h-12 w-12 flex-none place-items-center rounded-[14px] bg-surface2">
        <i className={`${icon} text-[26px] text-[#B5B5BA]`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[21px] font-semibold text-white">{label}</div>
        {description && (
          <div className="mt-1.5 text-[15px] leading-snug text-[#8F8F8F]">{description}</div>
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
  const { vehicles, isLoading, error } = useVehicles();

  // Muestra el vehículo registrado del conductor. Si la API aún no existe
  // (modo demo), se conserva el vehículo de demostración para no romper la vista.
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

  const handleLogout = () => {
    navigate('/acceso');
  };

  return (
    <div className="px-10 pb-10">
      {/* Header */}
      <PageHeader title="Perfil" subtitle="Tu información personal y configuración" />

      {/* Two-column layout: ambas columnas se estiran a la misma altura */}
      <div className="mt-8 flex gap-[30px]">
        {/* Left — Profile card (40%) */}
        <div className="flex w-[40%] flex-col items-center rounded-[24px] border border-[#353535] bg-[#222222] px-9 py-9">
          <Avatar initial="J" size={104} variant="solid" />

          {/* Name */}
          <h2 className="mt-4 text-center text-[40px] font-extrabold leading-tight text-white">
            Juan Ángel de la Torre
          </h2>

          {/* Academic info */}
          <p className="mt-1 text-[18px] font-medium text-[#9A9A9A]">
            Ing. Sistemas · 6to Semestre
          </p>

          {/* Verified badge */}
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-[#F5F5F5] px-[18px] py-2 text-sm font-bold text-black">
            <i className="bi bi-shield-check" />
            Conductor verificado
          </div>

          {/* Stats */}
          <div className="mt-7 flex gap-[14px]">
            <MiniStat value="4.8" label="Rating" />
            <MiniStat value="86" label="Viajes" />
            <MiniStat value="$5.2k" label="Ganado" />
          </div>
        </div>

        {/* Right — Settings panel (60%) */}
        <div className="flex w-[60%] flex-col">
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
