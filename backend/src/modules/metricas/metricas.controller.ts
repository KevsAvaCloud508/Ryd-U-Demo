import type { Request, Response } from 'express';

import {
  seedDatabase,
  getDashboardStats,
  getIncidenciaById,
  listIncidencias,
  createIncidencia,
  updateIncidencia,
  avanzarEstado,
  resolverIncidencia,
  deleteIncidencia,
  listUsuarios,
  getActividad,
  getReportes,
  getPasajerosMetrics,
  getConductoresMetrics,
} from './metricas.service.js';

export async function seedHandler(_req: Request, res: Response): Promise<void> {
  try {
    const result = await seedDatabase();
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al sembrar datos';
    res.status(500).json({ message });
  }
}

export async function dashboardStatsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener estadísticas';
    res.status(500).json({ message });
  }
}

export async function getIncidenciaByIdHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const inc = await getIncidenciaById(id);
    res.status(200).json(inc);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener incidencia';
    const status = message === 'Incidencia no encontrada' ? 404 : 500;
    res.status(status).json({ message });
  }
}

export async function listIncidenciasHandler(req: Request, res: Response): Promise<void> {
  try {
    const { search, estado, prioridad, page, limit } = req.query;
    const result = await listIncidencias({
      search: search as string | undefined,
      estado: estado as string | undefined,
      prioridad: prioridad as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al listar incidencias';
    res.status(500).json({ message });
  }
}

export async function createIncidenciaHandler(req: Request, res: Response): Promise<void> {
  try {
    const { titulo, descripcion, categoria, prioridad, estado } = req.body;
    if (!titulo || !descripcion || !categoria || !prioridad || !estado) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }
    const inc = await createIncidencia({ titulo, descripcion, categoria, prioridad, estado });
    res.status(201).json(inc);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear incidencia';
    res.status(500).json({ message });
  }
}

export async function updateIncidenciaHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const { titulo, descripcion, categoria, prioridad, estado } = req.body;
    const updated = await updateIncidencia(id, { titulo, descripcion, categoria, prioridad, estado });
    res.status(200).json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar incidencia';
    const status = message === 'Incidencia no encontrada' ? 404 : 500;
    res.status(status).json({ message });
  }
}

export async function avanzarEstadoHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const updated = await avanzarEstado(id);
    res.status(200).json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al avanzar estado';
    const status = message.includes('no encontrada') ? 404 : 400;
    res.status(status).json({ message });
  }
}

export async function resolverIncidenciaHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const updated = await resolverIncidencia(id);
    res.status(200).json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al resolver incidencia';
    const status = message.includes('no encontrada') ? 404 : 400;
    res.status(status).json({ message });
  }
}

export async function deleteIncidenciaHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    await deleteIncidencia(id);
    res.status(200).json({ message: 'Incidencia eliminada' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar incidencia';
    const status = message === 'Incidencia no encontrada' ? 404 : 500;
    res.status(status).json({ message });
  }
}

export async function listUsuariosHandler(req: Request, res: Response): Promise<void> {
  try {
    const { search, rol, estado } = req.query;
    const result = await listUsuarios({
      search: search as string | undefined,
      rol: rol as string | undefined,
      estado: estado as string | undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al listar usuarios';
    res.status(500).json({ message });
  }
}

export async function actividadHandler(_req: Request, res: Response): Promise<void> {
  try {
    const items = await getActividad();
    res.status(200).json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener actividad';
    res.status(500).json({ message });
  }
}

export async function reportesHandler(_req: Request, res: Response): Promise<void> {
  try {
    const reportes = await getReportes();
    res.status(200).json(reportes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener reportes';
    res.status(500).json({ message });
  }
}

export async function pasajerosMetricsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const data = await getPasajerosMetrics();
    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener métricas de pasajeros';
    res.status(500).json({ message });
  }
}

export async function conductoresMetricsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const data = await getConductoresMetrics();
    res.status(200).json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener métricas de conductores';
    res.status(500).json({ message });
  }
}
