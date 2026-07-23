import { Router } from 'express';

import { asyncHandler } from '../../shared/utils/async-handler';
import { registerHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(registerHandler));
