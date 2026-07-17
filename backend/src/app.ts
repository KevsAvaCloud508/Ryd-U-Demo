import cors from 'cors';
import express, { type Application } from 'express';

import { env } from './config/env.js';

/**
 * Construye y configura la instancia de Express.
 *
 * Aquí solo se registran los middlewares globales de infraestructura
 * (CORS y parseo de JSON). Las rutas de cada módulo se montarán más adelante
 * bajo el prefijo `/api`.
 */
export function createApp(): Application {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  // Endpoint mínimo para verificar que el servidor está vivo.
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Las rutas de los módulos se registrarán aquí:
  // app.use('/api/auth', authRouter);
  // app.use('/api/users', usersRouter);

  return app;
}
