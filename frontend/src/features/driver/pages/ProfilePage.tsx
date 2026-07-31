import { Link, useNavigate } from 'react-router-dom';

import { Avatar, MiniStat, PageHeader } from '../../../shared/components';

interface SettingsRowProps {
  icon: string;
  label: string;
  to: string;
}

function SettingsRow({ icon, label, to }: SettingsRowProps) {
  return (
    <Link
      to={to}
      className="flex h-[63px] w-full cursor-pointer items-center justify-between border-b border-[#353535] px-6 last:border-0 transition-colors hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-4">
        <i className={`${icon} text-xl text-[#8F8F8F]`} />
        <span className="text-[18px] font-medium text-white">{label}</span>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full">
        <i className="bi bi-chevron-right text-lg text-[#8F8F8F]" />
      </div>
    </Link>
  );
}

const settingsRows: SettingsRowProps[] = [
  { icon: 'bi bi-car-front', label: 'Mi vehículo · Ford Aveo Blanco', to: '/conductor/perfil/vehiculo' },
  { icon: 'bi bi-file-text', label: 'Documentos · Aprobados', to: '/conductor/perfil/documentos' },
  { icon: 'bi bi-bank', label: 'Cuenta para cobros', to: '/conductor/perfil/cuenta' },
  { icon: 'bi bi-bell', label: 'Notificaciones', to: '/conductor/perfil/notificaciones' },
  { icon: 'bi bi-shield-check', label: 'Seguridad', to: '/conductor/perfil/seguridad' },
];

export function DriverProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/acceso');
  };

  return (
    <div className="px-10 pb-10">
      {/* Header */}
      <PageHeader title="Perfil" subtitle="Tu información personal y configuración" />

      {/* Two-column layout */}
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
          <h2 className="text-[40px] font-extrabold leading-tight text-white">
            Vehículo y cuenta
          </h2>

          <div className="mt-5 rounded-[22px] border border-[#353535] bg-[#222222]">
            {settingsRows.map((row) => (
              <SettingsRow key={row.label} icon={row.icon} label={row.label} to={row.to} />
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
