import { Router } from 'express';

import { requireAuth } from '../../shared/middlewares/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';
import { photoUploadMiddleware } from '../../shared/utils/photo-upload';
import { forgotPasswordHandler, loginHandler, meHandler, registerHandler, resetPasswordHandler, updateProfileHandler, uploadPhotoHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(registerHandler));
authRouter.post('/login', asyncHandler(loginHandler));
authRouter.get('/me', requireAuth, asyncHandler(meHandler));
authRouter.patch('/profile', requireAuth, asyncHandler(updateProfileHandler));
authRouter.post('/photo', requireAuth, photoUploadMiddleware.single('photo'), asyncHandler(uploadPhotoHandler));
authRouter.post('/forgot-password', asyncHandler(forgotPasswordHandler));
authRouter.post('/reset-password', asyncHandler(resetPasswordHandler));
