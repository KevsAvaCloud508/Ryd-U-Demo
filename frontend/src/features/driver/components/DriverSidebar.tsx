import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  label: string;
  icon: string;
  path: string;
}

const navItems: SidebarItem[] = [
  { label: 'Panel', icon: 'bi bi-speedometer2', path: '/conductor/panel' },
  { label: 'Publicar ruta', icon: 'bi bi-plus-circle', path: '/conductor/publicar-ruta' },
  { label: 'Solicitudes', icon: 'bi bi-bell', path: '/conductor/solicitudes' },
  { label: 'Ganancias', icon: 'bi bi-cash-stack', path: '/conductor/ganancias' },
  { label: 'Perfil', icon: 'bi bi-person', path: '/conductor/perfil' },
];

export function DriverSidebar() {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <aside className="flex w-[260px] flex-col border-r border-[#202020] bg-black shrink-0">
      <div className="flex justify-center px-6 pt-12 pb-8">
        <img className="h-8 w-auto" src="/logo.svg" alt="RydU" />
      </div>

      <nav className="flex flex-1 flex-col gap-3 px-3">
        {navItems.map((item) => {
          const isActive = activePath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex h-[52px] items-center gap-3 text-lg font-semibold transition-all ${
                isActive
                  ? 'rounded-[18px] bg-[#F5F5F5] px-[18px] text-black'
                  : 'rounded-[18px] px-[18px] text-[#8C8C8C] hover:text-white/70'
              }`}
            >
              <i className={`${item.icon} text-xl ${isActive ? 'text-black' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-2 flex items-center gap-2 rounded-full bg-[#F5F5F5] px-[18px] py-3">
          <i className="bi bi-broadcast text-sm text-black" />
          <span className="text-sm font-bold text-black">En línea</span>
        </div>
      </nav>
    </aside>
  );
}
