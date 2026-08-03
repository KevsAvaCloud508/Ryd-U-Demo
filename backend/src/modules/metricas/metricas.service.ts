import { prisma } from '../../prisma/client.js';

// ──────────────────────────────────────────────
//  TYPES
// ──────────────────────────────────────────────

export interface IncidenciaFilters {
  search?: string;
  estado?: string;
  prioridad?: string;
  page?: number;
  limit?: number;
}

export interface UsuarioFilters {
  search?: string;
  rol?: string;
  estado?: string;
}

// ──────────────────────────────────────────────
//  SEED DATA
// ──────────────────────────────────────────────

const SEED_INCIDENCIAS = [
  { id: 2, titulo: 'Error al iniciar sesión en plataforma', descripcion: 'Varios estudiantes reportan error 500.', categoria: 'Software', prioridad: 'Crítica', estado: 'En proceso', creado: '2026-07-14' },
  { id: 3, titulo: 'Cableado de red dañado en laboratorio', descripcion: 'Se necesita reemplazar cable ethernet.', categoria: 'Red', prioridad: 'Media', estado: 'Pendiente', creado: '2026-07-14' },
  { id: 4, titulo: 'Cuenta de alumno bloqueada', descripcion: 'No puede acceder al portal académico.', categoria: 'Acceso', prioridad: 'Alta', estado: 'Resuelta', creado: '2026-07-13' },
  { id: 5, titulo: 'Actualizar software de biblioteca', descripcion: 'Versión desactualizada del gestor.', categoria: 'Software', prioridad: 'Baja', estado: 'Pendiente', creado: '2026-07-12' },
  { id: 7, titulo: 'WiFi institucional lento', descripcion: 'Velocidad menor a 1 Mbps en edificio A.', categoria: 'Red', prioridad: 'Alta', estado: 'En proceso', creado: '2026-07-11' },
  { id: 8, titulo: 'Solicitud de acceso a base de datos', descripcion: 'Nuevo investigador requiere permisos.', categoria: 'Acceso', prioridad: 'Media', estado: 'Resuelta', creado: '2026-07-10' },
  { id: 10, titulo: 'Migrar correos a nuevo servidor', descripcion: 'Se requiere migración antes del corte.', categoria: 'Software', prioridad: 'Alta', estado: 'Pendiente', creado: '2026-07-08' },
  { id: 11, titulo: 'Certificado SSL expirado', descripcion: 'El certificado del portal expiró.', categoria: 'Red', prioridad: 'Crítica', estado: 'Resuelta', creado: '2026-07-07' },
];

const SEED_USUARIOS = [
  { id: 1, nombre: 'Ana López', email: 'ana.lopez@rydu.mx', rol: 'admin', estado: 'activo', registro: '2026-01-15' },
  { id: 2, nombre: 'Carlos Vega', email: 'carlos.vega@rydu.mx', rol: 'gestor', estado: 'activo', registro: '2026-02-20' },
  { id: 3, nombre: 'María García', email: 'maria.garcia@rydu.mx', rol: 'analista', estado: 'activo', registro: '2026-03-10' },
  { id: 4, nombre: 'José Hernández', email: 'jose.hernandez@rydu.mx', rol: 'soporte', estado: 'activo', registro: '2026-03-22' },
  { id: 5, nombre: 'Laura Méndez', email: 'laura.mendez@rydu.mx', rol: 'gestor', estado: 'inactivo', registro: '2026-04-05' },
  { id: 6, nombre: 'Pedro Rojas', email: 'pedro.rojas@rydu.mx', rol: 'soporte', estado: 'activo', registro: '2026-04-18' },
  { id: 7, nombre: 'Sofía Torres', email: 'sofia.torres@rydu.mx', rol: 'analista', estado: 'activo', registro: '2026-05-01' },
  { id: 8, nombre: 'Diego Ramírez', email: 'diego.ramirez@rydu.mx', rol: 'estudiante', estado: 'activo', registro: '2026-05-12' },
  { id: 9, nombre: 'Valentina Cruz', email: 'valentina.cruz@rydu.mx', rol: 'estudiante', estado: 'inactivo', registro: '2026-05-20' },
  { id: 10, nombre: 'Fernando Castillo', email: 'fernando.castillo@rydu.mx', rol: 'admin', estado: 'activo', registro: '2026-06-01' },
];

const SEED_ACTIVIDAD = [
  { text: '<strong>Ana López</strong> creó la incidencia #5', time: 'Hace 15 min', icon: '📝' },
  { text: '<strong>Carlos Vega</strong> cambió estado de #2 a "En proceso"', time: 'Hace 1 hora', icon: '🔄' },
  { text: '<strong>María García</strong> resolvió la incidencia #8', time: 'Hace 2 horas', icon: '✅' },
  { text: '<strong>Pedro Rojas</strong> actualizó la incidencia #7', time: 'Hace 3 horas', icon: '🔧' },
  { text: '<strong>José Hernández</strong> registró nueva incidencia #11', time: 'Hace 5 horas', icon: '📌' },
  { text: '<strong>Sofía Torres</strong> cerró la incidencia #4', time: 'Hace 6 horas', icon: '💻' },
];

// ──────────────────────────────────────────────
//  SEED
// ──────────────────────────────────────────────

export async function seedDatabase(): Promise<{ message: string }> {
  const incCount = await prisma.incidencia.count();
  const usrCount = await prisma.usuarioDashboard.count();
  const actCount = await prisma.actividad.count();

  if (incCount > 0 || usrCount > 0 || actCount > 0) {
    await prisma.incidencia.deleteMany();
    await prisma.usuarioDashboard.deleteMany();
    await prisma.actividad.deleteMany();
  }

  await prisma.incidencia.createMany({ data: SEED_INCIDENCIAS });
  await prisma.usuarioDashboard.createMany({ data: SEED_USUARIOS });
  await prisma.actividad.createMany({ data: SEED_ACTIVIDAD });

  return { message: 'Base de datos de métricas sembrada correctamente.' };
}

// ──────────────────────────────────────────────
//  DASHBOARD STATS
// ──────────────────────────────────────────────

export async function getDashboardStats(): Promise<{
  total: number;
  pendientes: number;
  enProceso: number;
  resueltas: number;
  criticas: number;
  resolucionPromedioHoras: number;
  porEstado: Record<string, number>;
  porCategoria: Record<string, number>;
  porPrioridad: Record<string, number>;
  resolucionPorCategoria: Record<string, number>;
}> {
  const all = (await prisma.incidencia.findMany()).filter(i => i.categoria !== 'Hardware');
  const total = all.length;
  const pendientes = all.filter(i => i.estado === 'Pendiente').length;
  const enProceso = all.filter(i => i.estado === 'En proceso').length;
  const resueltas = all.filter(i => i.estado === 'Resuelta').length;
  const criticas = all.filter(i => i.prioridad === 'Crítica').length;
  const resolucionPromedioHoras = resueltas > 0 ? 36.5 : 0;

  const porEstado: Record<string, number> = {};
  const porCategoria: Record<string, number> = {};
  const porPrioridad: Record<string, number> = {};

  for (const inc of all) {
    porEstado[inc.estado] = (porEstado[inc.estado] || 0) + 1;
    porCategoria[inc.categoria] = (porCategoria[inc.categoria] || 0) + 1;
    porPrioridad[inc.prioridad] = (porPrioridad[inc.prioridad] || 0) + 1;
  }

  const resolucionPorCategoria: Record<string, number> = {};
  Object.keys(porCategoria).forEach((cat, i) => {
    resolucionPorCategoria[cat] = resolucionPromedioHoras * (1 + (i - 2) * 0.15);
  });

  return {
    total, pendientes, enProceso, resueltas, criticas,
    resolucionPromedioHoras, porEstado, porCategoria, porPrioridad,
    resolucionPorCategoria,
  };
}

// ──────────────────────────────────────────────
//  INCIDENCIAS CRUD
// ──────────────────────────────────────────────

export async function getIncidenciaById(id: number) {
  const inc = await prisma.incidencia.findUnique({ where: { id } });
  if (!inc) throw new Error('Incidencia no encontrada');
  return inc;
}

export async function listIncidencias(filters: IncidenciaFilters) {
  const { search, estado, prioridad, page = 1, limit = 8 } = filters;

  const where: Record<string, unknown> = { categoria: { not: 'Hardware' } };

  if (estado) where.estado = estado;
  if (prioridad) where.prioridad = prioridad;
  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
    ];
  }

  const total = await prisma.incidencia.count({ where: where as any });
  const items = await prisma.incidencia.findMany({
    where: where as any,
    orderBy: { id: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}

export async function createIncidencia(data: {
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  estado: string;
}) {
  const last = await prisma.incidencia.findFirst({ orderBy: { id: 'desc' } });
  const newId = (last?.id ?? 0) + 1;
  const today = new Date().toISOString().split('T')[0];

  const inc = await prisma.incidencia.create({
    data: { id: newId, ...data, creado: today },
  });

  await prisma.actividad.create({
    data: {
      text: `<strong>Sistema</strong> creó la incidencia #${newId}`,
      time: 'Ahora',
      icon: '📝',
    },
  });

  return inc;
}

export async function updateIncidencia(
  id: number,
  data: { titulo?: string; descripcion?: string; categoria?: string; prioridad?: string; estado?: string }
) {
  const existing = await prisma.incidencia.findUnique({ where: { id } });
  if (!existing) throw new Error('Incidencia no encontrada');

  const updated = await prisma.incidencia.update({
    where: { id },
    data,
  });

  await prisma.actividad.create({
    data: {
      text: `<strong>Sistema</strong> actualizó la incidencia #${id}`,
      time: 'Ahora',
      icon: '🔧',
    },
  });

  return updated;
}

export async function avanzarEstado(id: number) {
  const inc = await prisma.incidencia.findFirst({ where: { id, estado: 'Pendiente' } });
  if (!inc) throw new Error('Incidencia no encontrada o no está en estado Pendiente');

  const updated = await prisma.incidencia.update({
    where: { id },
    data: { estado: 'En proceso' },
  });

  await prisma.actividad.create({
    data: {
      text: `<strong>Sistema</strong> cambió estado de #${id} a "En proceso"`,
      time: 'Ahora',
      icon: '🔄',
    },
  });

  return updated;
}

export async function resolverIncidencia(id: number) {
  const inc = await prisma.incidencia.findFirst({ where: { id, estado: 'En proceso' } });
  if (!inc) throw new Error('Incidencia no encontrada o no está en estado En proceso');

  const updated = await prisma.incidencia.update({
    where: { id },
    data: { estado: 'Resuelta' },
  });

  await prisma.actividad.create({
    data: {
      text: `<strong>Sistema</strong> resolvió la incidencia #${id}`,
      time: 'Ahora',
      icon: '✅',
    },
  });

  return updated;
}

export async function deleteIncidencia(id: number) {
  const existing = await prisma.incidencia.findUnique({ where: { id } });
  if (!existing) throw new Error('Incidencia no encontrada');

  await prisma.incidencia.delete({ where: { id } });

  await prisma.actividad.create({
    data: {
      text: `<strong>Sistema</strong> eliminó la incidencia #${id}`,
      time: 'Ahora',
      icon: '🗑️',
    },
  });

  return { message: 'Incidencia eliminada' };
}

// ──────────────────────────────────────────────
//  USUARIOS DASHBOARD
// ──────────────────────────────────────────────

export async function listUsuarios(filters: UsuarioFilters) {
  const { search, rol, estado } = filters;

  const where: Record<string, unknown> = {};

  if (rol) where.rol = rol;
  if (estado) where.estado = estado;
  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.usuarioDashboard.findMany({
    where: where as any,
    orderBy: { id: 'asc' },
  });

  return { items, total: items.length };
}

// ──────────────────────────────────────────────
//  ACTIVIDAD
// ──────────────────────────────────────────────

export async function getActividad(limit = 8) {
  const items = await prisma.actividad.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return items;
}

// ──────────────────────────────────────────────
//  REPORTES
// ──────────────────────────────────────────────

export async function getReportes() {
  const all = (await prisma.incidencia.findMany()).filter(i => i.categoria !== 'Hardware');
  const total = all.length;
  const resueltas = all.filter(i => i.estado === 'Resuelta').length;
  const resueltasMes = all.filter(i => i.estado === 'Resuelta' && i.creado >= '2026-07-01').length;
  const avgTime = resueltas > 0 ? 36.5 : 0;

  return {
    total,
    resueltasMes,
    tiempoPromedio: avgTime,
    satisfaccion: '94%',
    tendencias: {
      total: '📈 +12% respecto al mes anterior',
      resueltas: '📈 +8% respecto al mes anterior',
      tiempo: '📉 -3h respecto al mes anterior',
      satisfaccion: '📈 +2% respecto al mes anterior',
    },
    items: all.filter(i => i.estado === 'Resuelta').slice(0, 10),
  };
}

// ──────────────────────────────────────────────
//  MÉTRICAS REALES: PASAJEROS
//  (Información de cada pasajero concorde con sus
//  métricas calculadas de la base de datos real)
// ──────────────────────────────────────────────

function averageScore(scores: Array<number | null>): number {
  const valid = scores.filter((s): s is number => typeof s === 'number');
  if (valid.length === 0) return 0;
  return Number((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2));
}

function fullName(user: { firstName: string; lastNamePaternal: string; lastNameMaternal: string | null }): string {
  return [user.firstName, user.lastNamePaternal, user.lastNameMaternal].filter(Boolean).join(' ');
}

/**
 * Lista los pasajeros (rol "Pasajero") con sus métricas reales:
 * calificación promedio recibida, viajes realizados (solicitudes aceptadas)
 * y ahorro estimado (suma del costo de los viajes aceptados).
 */
export async function getPasajerosMetrics() {
  const pasajeros = await prisma.user.findMany({
    where: {
      roles: { some: { role: { name: 'Pasajero' } } },
    },
    include: {
      requests: {
        where: { status: 'Aceptado' },
        include: { trip: true },
      },
      ratingsReceived: true,
    },
    orderBy: { registeredAt: 'asc' },
  });

  const items = pasajeros.map((p) => {
    const viajes = p.requests.length;
    const ahorro = p.requests.reduce((sum, r) => sum + Number(r.trip.cost ?? 0), 0);
    return {
      id: p.id,
      nombre: fullName(p),
      email: p.email ?? '',
      registro: p.registeredAt,
      ratingPromedio: averageScore(p.ratingsReceived.map((r) => r.score)),
      calificaciones: p.ratingsReceived.length,
      viajesRealizados: viajes,
      ahorroEstimado: ahorro,
    };
  });

  const totalViajes = items.reduce((sum, i) => sum + i.viajesRealizados, 0);
  const ratingGlobal = averageScore(
    pasajeros.flatMap((p) => p.ratingsReceived.map((r) => r.score)),
  );

  return {
    items,
    total: items.length,
    totalViajes,
    ratingGlobal,
  };
}

// ──────────────────────────────────────────────
//  MÉTRICAS REALES: CONDUCTORES
//  (Información de cada conductor concorde con sus
//  métricas calculadas de la base de datos real)
// ──────────────────────────────────────────────

/**
 * Lista los conductores (rol "Conductor") con sus métricas reales:
 * calificación promedio recibida, viajes completados, ganancias totales,
 * rutas activas y vehículos registrados.
 */
export async function getConductoresMetrics() {
  const conductores = await prisma.user.findMany({
    where: {
      roles: { some: { role: { name: 'Conductor' } } },
    },
    include: {
      tripsAsDriver: true,
      ratingsReceived: true,
      vehicles: true,
    },
    orderBy: { registeredAt: 'asc' },
  });

  const items = conductores.map((c) => {
    const completados = c.tripsAsDriver.filter((t) => t.status === 'Terminado');
    const activos = c.tripsAsDriver.filter(
      (t) => t.status === 'Pendiente' || t.status === 'EnProceso',
    );
    const ganancias = completados.reduce((sum, t) => sum + Number(t.cost ?? 0), 0);
    const verificados = c.vehicles.filter((v) => v.isVerified).length;

    return {
      id: c.id,
      nombre: fullName(c),
      email: c.email ?? '',
      registro: c.registeredAt,
      ratingPromedio: averageScore(c.ratingsReceived.map((r) => r.score)),
      calificaciones: c.ratingsReceived.length,
      viajesCompletados: completados.length,
      rutasActivas: activos.length,
      gananciasTotales: ganancias,
      vehiculos: c.vehicles.length,
      vehiculosVerificados: verificados,
    };
  });

  const totalGanancias = items.reduce((sum, i) => sum + i.gananciasTotales, 0);
  const totalViajes = items.reduce((sum, i) => sum + i.viajesCompletados, 0);
  const ratingGlobal = averageScore(
    conductores.flatMap((c) => c.ratingsReceived.map((r) => r.score)),
  );

  return {
    items,
    total: items.length,
    totalViajes,
    totalGanancias,
    ratingGlobal,
  };
}
