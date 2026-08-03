import cors from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';

import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { vehicleRouter } from './modules/vehicles/vehicle.routes.js';
import { routesRouter } from './modules/routes/routes.routes.js';
import { tripsRouter } from './modules/trips/trips.routes.js';
import { requestsRouter } from './modules/requests/requests.routes.js';
import { ratingsRouter } from './modules/ratings/ratings.routes.js';
import { notificationsRouter } from './modules/notifications/notifications.routes.js';
import { documentsRouter } from './modules/documents/documents.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { metricasRouter } from './modules/metricas/metricas.routes.js';

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

  // Archivos subidos a disco local (fotos de perfil y documentos) cuando no
  // hay credenciales de Cloudinary configuradas.
  app.use('/uploads', express.static(env.uploadsDir));

  // Endpoint mínimo para verificar que el servidor está vivo.
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/vehicles', vehicleRouter);
  app.use('/api/routes', routesRouter);
  app.use('/api/trips', tripsRouter);
  app.use('/api/requests', requestsRouter);
  app.use('/api/ratings', ratingsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/documents', documentsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/metricas', metricasRouter);

  // Manejador de errores centralizado: cualquier excepción no controlada por un
  // módulo termina aquí en lugar de tirar el proceso.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    // Errores de multer (archivo demasiado grande o tipo no permitido):
    // se responden con 400 y un mensaje claro para el usuario.
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'El archivo no puede superar 5MB.'
          : `Error al procesar el archivo: ${err.message}`;
      res.status(400).json({ message });
      return;
    }
    if (err instanceof Error && err.message.includes('Tipo de archivo no permitido')) {
      res.status(400).json({ message: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  });

  return app;
}
