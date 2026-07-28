import { Pill, Sidebar } from '../../../shared/components';

type DriverSection = 'panel' | 'publicar' | 'solicitudes' | 'ganancias' | 'perfil' | 'validacion';

interface DriverSidebarProps {
  active: DriverSection;
  online?: boolean;
}

// Menú lateral común a las pantallas del conductor ya verificado
export function DriverSidebar({ active, online = true }: DriverSidebarProps) {
  return (
    <Sidebar
      items={[
        { label: 'Panel', href: '/conductor/panel', icon: <i className="bi bi-speedometer2" />, active: active === 'panel' },
        { label: 'Publicar ruta', href: '/conductor/publicar', icon: <i className="bi bi-plus-circle" />, active: active === 'publicar' },
        { label: 'Solicitudes', href: '/conductor/solicitudes', icon: <i className={active === 'solicitudes' ? 'bi bi-bell-fill' : 'bi bi-bell'} />, active: active === 'solicitudes' },
        { label: 'Ganancias', href: '/conductor/ganancias', icon: <i className="bi bi-cash-stack" />, active: active === 'ganancias' },
        { label: 'Perfil', href: '/conductor/perfil', icon: <i className={active === 'perfil' ? 'bi bi-person-fill' : 'bi bi-person'} />, active: active === 'perfil' },
        { label: 'Verificacion', href: '/conductor/validacion', icon: <i className={active === 'validacion' ? 'bi bi-patch-check-fill' : 'bi bi-patch-check'} />, active: active === 'validacion' },
      ]}
      status={
        <Pill variant={online ? 'white' : 'outline'}>
          <i className="bi bi-broadcast" /> En línea
        </Pill>
      }
    />
  );
}
