import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import { loadNotifications, readAll, readNotification } from '../store/notifications.slice';

export function useNotifications() {
  const dispatch = useAppDispatch();
  const { items, unreadCount, status } = useAppSelector((state) => state.notifications);

  const load = useCallback(() => dispatch(loadNotifications()).unwrap(), [dispatch]);
  const markAsRead = useCallback((id: string) => dispatch(readNotification(id)).unwrap(), [dispatch]);
  const markAllAsRead = useCallback(() => dispatch(readAll()).unwrap(), [dispatch]);

  return {
    notifications: items,
    unreadCount,
    isLoading: status === 'loading',
    hasError: status === 'failed',
    markAsRead,
    markAllAsRead,
    load,
  };
}
