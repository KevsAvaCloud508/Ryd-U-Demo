import { Router } from 'express';

import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  seedHandler,
  dashboardStatsHandler,
  getIncidenciaByIdHandler,
  listIncidenciasHandler,
  createIncidenciaHandler,
  updateIncidenciaHandler,
  avanzarEstadoHandler,
  resolverIncidenciaHandler,
  deleteIncidenciaHandler,
  listUsuariosHandler,
  actividadHandler,
  reportesHandler,
} from './metricas.controller.js';

export const metricasRouter = Router();

// Seed
metricasRouter.post('/seed', asyncHandler(seedHandler));

// Dashboard stats
metricasRouter.get('/dashboard', asyncHandler(dashboardStatsHandler));

// Incidencias CRUD
metricasRouter.get('/incidencias', asyncHandler(listIncidenciasHandler));
metricasRouter.get('/incidencias/:id', asyncHandler(getIncidenciaByIdHandler));
metricasRouter.post('/incidencias', asyncHandler(createIncidenciaHandler));
metricasRouter.put('/incidencias/:id', asyncHandler(updateIncidenciaHandler));
metricasRouter.patch('/incidencias/:id/avanzar', asyncHandler(avanzarEstadoHandler));
metricasRouter.patch('/incidencias/:id/resolver', asyncHandler(resolverIncidenciaHandler));
metricasRouter.delete('/incidencias/:id', asyncHandler(deleteIncidenciaHandler));

// Usuarios
metricasRouter.get('/usuarios', asyncHandler(listUsuariosHandler));

// Actividad
metricasRouter.get('/actividad', asyncHandler(actividadHandler));

// Reportes
metricasRouter.get('/reportes', asyncHandler(reportesHandler));
