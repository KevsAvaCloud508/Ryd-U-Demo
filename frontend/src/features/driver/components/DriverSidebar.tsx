import { Link, useLocation } from 'react-router-dom';

import { useVerification } from '../context/VerificationContext';

interface SidebarItem {
  label: string;
  icon: string;
  path: string;
}

const verificationNav: SidebarItem[] = [
  { label: 'Verificación', icon: 'bi bi-patch-check', path: '/conductor/validacion' },
  { label: 'Panel', icon: 'bi bi-speedometer2', path: '/conductor/panel' },
  { label: 'Rutas', icon: 'bi bi-plus-circle', path: '/conductor/rutas' },
  { label: 'Solicitudes', icon: 'bi bi-bell', path: '/conductor/solicitudes' },
  { label: 'Ganancias', icon: 'bi bi-cash-stack', path: '/conductor/ganancias' },
];

const panelNav: SidebarItem[] = [
  { label: 'Panel', icon: 'bi bi-speedometer2', path: '/conductor/panel' },
  { label: 'Rutas', icon: 'bi bi-plus-circle', path: '/conductor/rutas' },
  { label: 'Solicitudes', icon: 'bi bi-bell', path: '/conductor/solicitudes' },
  { label: 'Ganancias', icon: 'bi bi-cash-stack', path: '/conductor/ganancias' },
  { label: 'Perfil', icon: 'bi bi-person', path: '/conductor/perfil' },
];

export function DriverSidebar() {
  const location = useLocation();
  const activePath = location.pathname;
  const isVerification = activePath === '/conductor/validacion';
  const { submitted } = useVerification();

  const navItems = isVerification ? verificationNav : panelNav;

  return (
    <>
      {/* ── Sidebar de escritorio (lg+) ── */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#202020] bg-black lg:flex">
        <div className="flex justify-center px-6 pt-12 pb-8">
          <img className="h-8 w-auto" src="/logo.svg" alt="RydU" />
        </div>

        <nav className="flex flex-1 flex-col gap-3 px-3">
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            const isDisabled =
              isVerification && item.path !== '/conductor/validacion';

            return (
              <Link
                key={item.path}
                to={isDisabled ? '#' : item.path}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
                className={`flex h-[52px] items-center gap-3 text-lg font-semibold transition-all ${
                  isActive
                    ? 'rounded-[18px] bg-[#F5F5F5] px-[18px] text-black'
                    : 'rounded-[18px] px-[18px] text-[#8C8C8C] hover:text-white/70'
                } ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <i className={`${item.icon} text-xl ${isActive ? 'text-black' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isVerification && (
            <div className="mt-2 flex items-center gap-2 rounded-full border border-[#2c2c2c] bg-[#090909] px-[18px] py-3">
              <i className="bi bi-hourglass-split text-sm text-[#8d8d8d]" />
              <span className="text-sm font-bold text-[#8d8d8d]">
                {submitted ? 'En revisión' : '-'}
              </span>
            </div>
          )}

          {!isVerification && (
            <div className="mt-2 flex items-center gap-2 rounded-full bg-[#F5F5F5] px-[18px] py-3">
              <i className="bi bi-broadcast text-sm text-black" />
              <span className="text-sm font-bold text-black">En línea</span>
            </div>
          )}
        </nav>
      </aside>

      {/* ── Barra superior móvil (< lg): logo + navegación horizontal ── */}
      <div className="sticky top-0 z-40 w-full border-b border-[#202020] bg-black lg:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <img className="h-6 w-auto" src="/logo.svg" alt="RydU" />
          <div className="ml-auto flex items-center gap-2">
            {isVerification ? (
              <span className="flex items-center gap-1.5 rounded-full border border-[#2c2c2c] bg-[#090909] px-3 py-1 text-xs font-bold text-[#8d8d8d]">
                <i className="bi bi-hourglass-split" />
                {submitted ? 'En revisión' : 'Pendiente'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-[#F5F5F5] px-3 py-1 text-xs font-bold text-black">
                <i className="bi bi-broadcast" />
                En línea
              </span>
            )}
          </div>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-3 pb-2.5">
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            const isDisabled =
              isVerification && item.path !== '/conductor/validacion';

            return (
              <Link
                key={item.path}
                to={isDisabled ? '#' : item.path}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all ${
                  isActive
                    ? 'bg-[#F5F5F5] text-black'
                    : 'text-[#8C8C8C] hover:text-white/70'
                } ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <i className={`${item.icon} ${isActive ? 'text-black' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
