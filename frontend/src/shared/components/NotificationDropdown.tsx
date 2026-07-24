import { useEffect, useRef, useState } from 'react';

/**
 * Tipos para las notificaciones que recibe el dropdown.
 * Se define aqui para evitar dependencias con el modulo de features.
 */
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  requestedAt: string;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  hasError?: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

/**
 * Dropdown de notificaciones con badge de count.
 * Componente presentacional puro: recibe datos via props desde el componente padre.
 * No depende de ningun hook de features para mantener la separacion de capas.
 * El padre (NotificationBell) es responsable de cargar los datos via useNotifications.
 */
export function NotificationDropdown({
  notifications,
  unreadCount,
  isLoading,
  hasError = false,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Boton de campana con badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted hover:text-white transition-colors"
        aria-label="Notificaciones"
      >
        <i className="bi bi-bell text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-line bg-surface shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-bold text-white">Notificaciones</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-xs text-muted hover:text-white transition-colors"
              >
                Marcar todo como leido
              </button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                Cargando notificaciones...
              </div>
            )}

            {!isLoading && hasError && (
              <div className="px-4 py-8 text-center text-sm text-red-400">
                Error al cargar notificaciones
              </div>
            )}

            {!isLoading && !hasError && notifications.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                No tienes notificaciones
              </div>
            )}

            {!isLoading && !hasError && notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
                className={`border-b border-line px-4 py-3 cursor-pointer transition-colors hover:bg-surface2 ${
                  !notification.isRead ? 'bg-surface2/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2 w-2 flex-none rounded-full ${!notification.isRead ? 'bg-white' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{notification.title}</div>
                    <div className="mt-0.5 text-xs text-muted line-clamp-2">{notification.message}</div>
                    <div className="mt-1 text-[10px] text-muted">
                      {new Date(notification.requestedAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-line px-4 py-2.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-xs text-muted hover:text-white transition-colors"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
