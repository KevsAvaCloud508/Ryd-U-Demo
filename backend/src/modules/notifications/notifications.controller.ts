import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { HttpError } from '../../shared/utils/http-error';
import { listNotifications, listUnreadNotifications, readAllNotifications, readNotification } from './notifications.service';

export async function listNotificationsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const notifications = await listNotifications(req.user!.sub);
  res.json({ notifications });
}

export async function listUnreadHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const notifications = await listUnreadNotifications(req.user!.sub);
  res.json({ notifications });
}

export async function markAsReadHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const notification = await readNotification(req.user!.sub, req.params.id);
    res.json({ notification });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function markAllAsReadHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  await readAllNotifications(req.user!.sub);
  res.json({ message: 'Notificaciones marcadas como leídas.' });
}
