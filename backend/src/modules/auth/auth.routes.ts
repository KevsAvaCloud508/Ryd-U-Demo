import { Router } from 'express';

import { requireAuth } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { photoUploadMiddleware } from '../../shared/utils/photo-upload.js';
import { forgotPasswordHandler, loginHandler, meHandler, registerHandler, resetPasswordHandler, updateProfileHandler, uploadPhotoHandler } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(registerHandler));
authRouter.post('/login', asyncHandler(loginHandler));
authRouter.get('/me', requireAuth, asyncHandler(meHandler));
authRouter.patch('/profile', requireAuth, asyncHandler(updateProfileHandler));
authRouter.post('/photo', requireAuth, photoUploadMiddleware.single('photo'), asyncHandler(uploadPhotoHandler));
authRouter.post('/forgot-password', asyncHandler(forgotPasswordHandler));
authRouter.post('/reset-password', asyncHandler(resetPasswordHandler));
