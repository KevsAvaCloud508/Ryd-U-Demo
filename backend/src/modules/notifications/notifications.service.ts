import { HttpError } from '../../shared/utils/http-error';
import {
  findNotificationById,
  findNotificationsByUser,
  findUnreadNotificationsByUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './notifications.repository';

export function listNotifications(userId: string) {
  return findNotificationsByUser(userId);
}

export function listUnreadNotifications(userId: string) {
  return findUnreadNotificationsByUser(userId);
}

export async function readNotification(userId: string, notificationId: string) {
  const notification = await findNotificationById(notificationId);
  if (!notification) throw new HttpError('Notificación no encontrada.', 404);
  if (notification.userId !== userId) {
    throw new HttpError('No tienes permiso para leer esta notificación.', 403);
  }
  return markNotificationAsRead(notificationId);
}

export function readAllNotifications(userId: string) {
  return markAllNotificationsAsRead(userId);
}
