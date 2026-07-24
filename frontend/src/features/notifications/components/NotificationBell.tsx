import { useEffect } from 'react';
import { NotificationDropdown } from '../../../shared/components';
import { useNotifications } from '../hooks/useNotifications';

/**
 * Wrapper que conecta el NotificationDropdown presentacional con el hook de notificaciones.
 * Mantiene la separacion de capas: shared/components no depende de features,
 * y este componente actua como puente entre ambas capas.
 * La carga inicial se ejecuta en useEffect al montar el componente.
 */
export function NotificationBell() {
  const { notifications, unreadCount, isLoading, hasError, load, markAsRead, markAllAsRead } = useNotifications();

  // Cargar notificaciones al montar
  useEffect(() => {
    load();
  }, [load]);

  return (
    <NotificationDropdown
      notifications={notifications}
      unreadCount={unreadCount}
      isLoading={isLoading}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      hasError={hasError}
    />
  );
}
