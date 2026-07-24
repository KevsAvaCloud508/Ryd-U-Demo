import cors from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';

import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';

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

  app.use('/api/auth', authRouter);

  // Manejador de errores centralizado: cualquier excepción no controlada por un
  // módulo termina aquí en lugar de tirar el proceso.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  });

  return app;
}
