import { Router } from 'express';

import { requireAuth } from '../../shared/middlewares/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';
import {
  listNotificationsHandler,
  listUnreadHandler,
  markAllAsReadHandler,
  markAsReadHandler,
} from './notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', asyncHandler(listNotificationsHandler));
notificationsRouter.get('/unread', asyncHandler(listUnreadHandler));
notificationsRouter.patch('/:id/read', asyncHandler(markAsReadHandler));
notificationsRouter.post('/read-all', asyncHandler(markAllAsReadHandler));
