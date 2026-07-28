import { api } from '../../../shared/api/axios';
import type { Notification } from '../types/notifications.types';

export async function fetchNotifications(): Promise<Notification[]> {
  const { data } = await api.get<{ notifications: Notification[] }>('/notifications');
  return data.notifications;
}

export async function fetchUnreadNotifications(): Promise<Notification[]> {
  const { data } = await api.get<{ notifications: Notification[] }>('/notifications/unread');
  return data.notifications;
}

export async function markAsRead(id: string): Promise<Notification> {
  const { data } = await api.patch<{ notification: Notification }>(`/notifications/${id}/read`);
  return data.notification;
}

export async function markAllAsRead(): Promise<void> {
  await api.post('/notifications/read-all');
}
