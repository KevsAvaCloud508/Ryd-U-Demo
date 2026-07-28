import { prisma } from '../../prisma/client';

export function findNotificationsByUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { requestedAt: 'desc' },
  });
}

export function findUnreadNotificationsByUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { requestedAt: 'desc' },
  });
}

export function findNotificationById(id: string) {
  return prisma.notification.findUnique({ where: { id } });
}

export function createNotification(userId: string, title: string, message: string) {
  return prisma.notification.create({
    data: { userId, title, message },
  });
}

export function markNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
