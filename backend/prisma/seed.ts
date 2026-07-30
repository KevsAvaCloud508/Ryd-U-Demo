import bcrypt from 'bcrypt';
import { prisma } from '../src/prisma/client.js';

// Seed idempotente (upserts con IDs fijos): se puede ejecutar varias veces
// sin duplicar datos. Todos los usuarios comparten la contraseña de prueba
// "Password123!" hasheada con el mismo costo que usa auth.service (10).

const PASSWORD = 'Password123!';
const SALT_ROUNDS = 10;

const IDS = {
  carlos: 'a1899850-7031-435b-92d7-3d3f86db115b',
  maria: 'b2f1c3d4-1111-4a2b-9c3d-000000000002',
  juan: 'c3a2b4e5-2222-4b3c-8d4e-000000000003',
  ana: 'd4b3c5f6-3333-4c4d-9e5f-000000000004',
  luis: 'e5c4d6a7-4444-4d5e-8f6a-000000000005',
  sofia: 'f6d5e7b8-5555-4e6f-9a7b-000000000006',
  admin: 'a7e6f8c9-7777-4a8b-9c9d-000000000007',
  vehCarlos: '11111111-aaaa-4111-8111-000000000001',
  vehMaria: '22222222-bbbb-4222-8222-000000000002',
  vehSofia: '33333333-cccc-4333-8333-000000000003',
  rutaCentro: '44444444-dddd-4444-8444-000000000001',
  rutaJesusMaria: '44444444-dddd-4444-8444-000000000002',
  rutaPlazaVestir: '44444444-dddd-4444-8444-000000000003',
  rutaVillaSur: '44444444-dddd-4444-8444-000000000004',
  viajeTerminado: '55555555-eeee-4555-8555-000000000001',
  viajeEnProceso: '55555555-eeee-4555-8555-000000000002',
  viajePendiente1: '55555555-eeee-4555-8555-000000000003',
  viajePendiente2: '55555555-eeee-4555-8555-000000000004',
  viajePendiente3: '55555555-eeee-4555-8555-000000000005',
} as const;

// Prisma serializa columnas TIME a partir de la hora UTC de un DateTime.
const hora = (hhmm: string) => new Date(`1970-01-01T${hhmm}:00.000Z`);

async function main() {
  // --- Roles -----------------------------------------------------------
  const roleNames = ['Pasajero', 'Conductor', 'Administrador'];
  const roles: Record<string, number> = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
    roles[name] = role.id;
  }

  // --- Usuarios ---------------------------------------------------------
  const passwordHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  const usuarios = [
    {
      id: IDS.carlos,
      firstName: 'Carlos',
      lastNamePaternal: 'Ramírez',
      lastNameMaternal: 'Torres',
      email: 'carlos.driver@alumnos.upa.edu.mx',
      phone: '4491112233',
      roles: ['Conductor', 'Pasajero'],
    },
    {
      id: IDS.maria,
      firstName: 'María',
      lastNamePaternal: 'González',
      lastNameMaternal: 'López',
      email: 'maria.gonzalez@alumnos.upa.edu.mx',
      phone: '4492223344',
      roles: ['Conductor', 'Pasajero'],
    },
    {
      id: IDS.juan,
      firstName: 'Juan',
      lastNamePaternal: 'Pérez',
      lastNameMaternal: 'Hernández',
      email: 'juan.perez@alumnos.upa.edu.mx',
      phone: '4493334455',
      roles: ['Pasajero'],
    },
    {
      id: IDS.ana,
      firstName: 'Ana',
      lastNamePaternal: 'Martínez',
      lastNameMaternal: 'Ruiz',
      email: 'ana.martinez@alumnos.upa.edu.mx',
      phone: '4494445566',
      roles: ['Pasajero'],
    },
    {
      id: IDS.luis,
      firstName: 'Luis',
      lastNamePaternal: 'Sánchez',
      lastNameMaternal: 'Díaz',
      email: 'luis.sanchez@alumnos.upa.edu.mx',
      phone: '4495556677',
      roles: ['Pasajero'],
    },
    {
      id: IDS.sofia,
      firstName: 'Sofía',
      lastNamePaternal: 'Torres',
      lastNameMaternal: 'Vega',
      email: 'sofia.torres@alumnos.upa.edu.mx',
      phone: '4496667788',
      roles: ['Pasajero', 'Conductor'],
    },
    {
      id: IDS.admin,
      firstName: 'Admin',
      lastNamePaternal: 'Ryd-U',
      lastNameMaternal: null,
      email: 'admin@upa.edu.mx',
      phone: '4490000000',
      roles: ['Administrador'],
    },
  ];

  for (const u of usuarios) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        firstName: u.firstName,
        lastNamePaternal: u.lastNamePaternal,
        lastNameMaternal: u.lastNameMaternal,
        email: u.email,
        phone: u.phone,
        passwordHash,
      },
    });
    for (const roleName of u.roles) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: u.id, roleId: roles[roleName] } },
        update: {},
        create: { userId: u.id, roleId: roles[roleName] },
      });
    }
  }

  // --- Vehículos ----------------------------------------------------------
  const vehiculos = [
    {
      id: IDS.vehCarlos,
      userId: IDS.carlos,
      brand: 'Nissan',
      model: 'Versa',
      color: 'Rojo',
      plates: 'AGS-123-A',
      capacity: 4,
      year: 2020,
      isVerified: true,
    },
    {
      id: IDS.vehMaria,
      userId: IDS.maria,
      brand: 'Volkswagen',
      model: 'Jetta',
      color: 'Gris',
      plates: 'AGS-456-B',
      capacity: 4,
      year: 2019,
      isVerified: true,
    },
    {
      id: IDS.vehSofia,
      userId: IDS.sofia,
      brand: 'Chevrolet',
      model: 'Aveo',
      color: 'Blanco',
      plates: 'AGS-789-C',
      capacity: 4,
      year: 2018,
      isVerified: false,
    },
  ];
  for (const v of vehiculos) {
    await prisma.vehicle.upsert({ where: { id: v.id }, update: {}, create: v });
  }

  // --- Rutas ---------------------------------------------------------------
  const rutas = [
    {
      id: IDS.rutaCentro,
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Centro de Aguascalientes',
      description: 'Salida por Av. Aguascalientes Sur hacia el centro histórico.',
      distanceKm: 12.5,
      estimatedMinutes: 25,
    },
    {
      id: IDS.rutaJesusMaria,
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Jesús María',
      description: 'Ruta por Av. Aguascalientes Poniente y carretera a Jesús María.',
      distanceKm: 18.3,
      estimatedMinutes: 35,
    },
    {
      id: IDS.rutaPlazaVestir,
      origin: 'Plaza Vestir',
      destination: 'UPA - Universidad Politécnica de Aguascalientes',
      description: 'Recogida en Plaza Vestir rumbo a la universidad.',
      distanceKm: 9.8,
      estimatedMinutes: 20,
    },
    {
      id: IDS.rutaVillaSur,
      origin: 'UPA - Universidad Politécnica de Aguascalientes',
      destination: 'Villas de Nuestra Señora de la Asunción',
      description: 'Ruta al oriente de la ciudad por segundo anillo.',
      distanceKm: 15.0,
      estimatedMinutes: 30,
    },
  ];
  for (const r of rutas) {
    await prisma.route.upsert({ where: { id: r.id }, update: {}, create: r });
  }

  // --- Viajes ----------------------------------------------------------------
  const viajes = [
    {
      id: IDS.viajeTerminado,
      driverId: IDS.carlos,
      vehicleId: IDS.vehCarlos,
      routeId: IDS.rutaCentro,
      date: new Date('2026-07-10'),
      departureTime: hora('14:30'),
      availableSeats: 1,
      cost: 35.0,
      status: 'Terminado' as const,
    },
    {
      id: IDS.viajeEnProceso,
      driverId: IDS.maria,
      vehicleId: IDS.vehMaria,
      routeId: IDS.rutaJesusMaria,
      date: new Date('2026-07-17'),
      departureTime: hora('07:00'),
      availableSeats: 2,
      cost: 45.0,
      status: 'EnProceso' as const,
    },
    {
      id: IDS.viajePendiente1,
      driverId: IDS.carlos,
      vehicleId: IDS.vehCarlos,
      routeId: IDS.rutaPlazaVestir,
      date: new Date('2026-07-20'),
      departureTime: hora('08:15'),
      availableSeats: 3,
      cost: 30.0,
      status: 'Pendiente' as const,
    },
    {
      id: IDS.viajePendiente2,
      driverId: IDS.maria,
      vehicleId: IDS.vehMaria,
      routeId: IDS.rutaCentro,
      date: new Date('2026-07-21'),
      departureTime: hora('15:45'),
      availableSeats: 4,
      cost: 35.0,
      status: 'Pendiente' as const,
    },
    {
      id: IDS.viajePendiente3,
      driverId: IDS.carlos,
      vehicleId: IDS.vehCarlos,
      routeId: IDS.rutaVillaSur,
      date: new Date('2026-07-22'),
      departureTime: hora('18:00'),
      availableSeats: 4,
      cost: 40.0,
      status: 'Pendiente' as const,
    },
  ];
  for (const v of viajes) {
    await prisma.trip.upsert({ where: { id: v.id }, update: {}, create: v });
  }

  // --- Solicitudes de viaje -----------------------------------------------
  const solicitudes = [
    // Viaje terminado: Juan y Ana viajaron con Carlos.
    { id: '66666666-aaaa-4666-8666-000000000001', tripId: IDS.viajeTerminado, passengerId: IDS.juan, status: 'Aceptado' as const },
    { id: '66666666-aaaa-4666-8666-000000000002', tripId: IDS.viajeTerminado, passengerId: IDS.ana, status: 'Aceptado' as const },
    // Viaje en proceso: Luis va con María; Sofía canceló.
    { id: '66666666-aaaa-4666-8666-000000000003', tripId: IDS.viajeEnProceso, passengerId: IDS.luis, status: 'Aceptado' as const },
    { id: '66666666-aaaa-4666-8666-000000000004', tripId: IDS.viajeEnProceso, passengerId: IDS.sofia, status: 'Cancelado' as const },
    // Viajes pendientes: solicitudes en distintos estados.
    { id: '66666666-aaaa-4666-8666-000000000005', tripId: IDS.viajePendiente1, passengerId: IDS.ana, status: 'Pendiente' as const },
    { id: '66666666-aaaa-4666-8666-000000000006', tripId: IDS.viajePendiente1, passengerId: IDS.luis, status: 'Aceptado' as const },
    { id: '66666666-aaaa-4666-8666-000000000007', tripId: IDS.viajePendiente2, passengerId: IDS.juan, status: 'Rechazado' as const },
    { id: '66666666-aaaa-4666-8666-000000000008', tripId: IDS.viajePendiente2, passengerId: IDS.sofia, status: 'Pendiente' as const },
  ];
  for (const s of solicitudes) {
    await prisma.tripRequest.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  // --- Calificaciones (del viaje terminado) ---------------------------------
  const calificaciones = [
    { id: '77777777-bbbb-4777-8777-000000000001', tripId: IDS.viajeTerminado, raterId: IDS.juan, rateeId: IDS.carlos, score: 5 },
    { id: '77777777-bbbb-4777-8777-000000000002', tripId: IDS.viajeTerminado, raterId: IDS.ana, rateeId: IDS.carlos, score: 4 },
    { id: '77777777-bbbb-4777-8777-000000000003', tripId: IDS.viajeTerminado, raterId: IDS.carlos, rateeId: IDS.juan, score: 5 },
    { id: '77777777-bbbb-4777-8777-000000000004', tripId: IDS.viajeTerminado, raterId: IDS.carlos, rateeId: IDS.ana, score: 5 },
  ];
  for (const c of calificaciones) {
    await prisma.rating.upsert({ where: { id: c.id }, update: {}, create: c });
  }

  // --- Notificaciones --------------------------------------------------------
  const notificaciones = [
    {
      id: '88888888-cccc-4888-8888-000000000001',
      userId: IDS.carlos,
      title: 'Nueva solicitud de viaje',
      message: 'Ana Martínez solicitó unirse a tu viaje Plaza Vestir → UPA del 20 de julio.',
      isRead: false,
    },
    {
      id: '88888888-cccc-4888-8888-000000000002',
      userId: IDS.luis,
      title: 'Solicitud aceptada',
      message: 'Carlos Ramírez aceptó tu solicitud para el viaje Plaza Vestir → UPA.',
      isRead: false,
    },
    {
      id: '88888888-cccc-4888-8888-000000000003',
      userId: IDS.juan,
      title: 'Solicitud rechazada',
      message: 'Tu solicitud para el viaje UPA → Centro del 21 de julio fue rechazada.',
      isRead: true,
    },
    {
      id: '88888888-cccc-4888-8888-000000000004',
      userId: IDS.carlos,
      title: 'Calificación recibida',
      message: 'Recibiste una calificación de 5 estrellas por tu viaje UPA → Centro.',
      isRead: true,
    },
    {
      id: '88888888-cccc-4888-8888-000000000005',
      userId: IDS.sofia,
      title: 'Documento en revisión',
      message: 'Tu licencia de conducción está en revisión. Te avisaremos cuando sea validada.',
      isRead: false,
    },
  ];
  for (const n of notificaciones) {
    await prisma.notification.upsert({ where: { id: n.id }, update: {}, create: n });
  }

  // --- Documentos de verificación -------------------------------------------
  const documentos = [
    { id: '99999999-dddd-4999-8999-000000000001', userId: IDS.carlos, type: 'LicenciaConduccion' as const, fileUrl: 'https://res.cloudinary.com/demo/ryd-u/carlos-licencia.jpg', status: 'Aceptado' as const },
    { id: '99999999-dddd-4999-8999-000000000002', userId: IDS.carlos, type: 'CredencialEstudiante' as const, fileUrl: 'https://res.cloudinary.com/demo/ryd-u/carlos-credencial.jpg', status: 'Aceptado' as const },
    { id: '99999999-dddd-4999-8999-000000000003', userId: IDS.maria, type: 'INE' as const, fileUrl: 'https://res.cloudinary.com/demo/ryd-u/maria-ine.jpg', status: 'Aceptado' as const },
    { id: '99999999-dddd-4999-8999-000000000004', userId: IDS.maria, type: 'PolizaVigente' as const, fileUrl: 'https://res.cloudinary.com/demo/ryd-u/maria-poliza.pdf', status: 'Aceptado' as const },
    { id: '99999999-dddd-4999-8999-000000000005', userId: IDS.sofia, type: 'LicenciaConduccion' as const, fileUrl: 'https://res.cloudinary.com/demo/ryd-u/sofia-licencia.jpg', status: 'Pendiente' as const },
    { id: '99999999-dddd-4999-8999-000000000006', userId: IDS.juan, type: 'CredencialEstudiante' as const, fileUrl: 'https://res.cloudinary.com/demo/ryd-u/juan-credencial.jpg', status: 'Aceptado' as const },
    {
      id: '99999999-dddd-4999-8999-000000000007',
      userId: IDS.luis,
      type: 'CredencialEstudiante' as const,
      fileUrl: 'https://res.cloudinary.com/demo/ryd-u/luis-credencial.jpg',
      status: 'Rechazado' as const,
      notes: 'La imagen está borrosa, vuelve a subir la credencial.',
    },
  ];
  for (const d of documentos) {
    await prisma.verificationDocument.upsert({ where: { id: d.id }, update: {}, create: d });
  }

  // Usuario registrado desde la app (up230190): si existe, se le dejan los
  // cuatro tipos de documento ya aceptados para que quede verificado.
  const juanRamon = await prisma.user.findUnique({ where: { email: 'up230190@alumnos.upa.edu.mx' } });
  if (juanRamon) {
    const tiposDocumento = ['INE', 'LicenciaConduccion', 'CredencialEstudiante', 'PolizaVigente'] as const;
    for (const [i, type] of tiposDocumento.entries()) {
      await prisma.verificationDocument.upsert({
        where: { id: `99999999-dddd-4999-8999-00000000001${i}` },
        update: { userId: juanRamon.id, type, status: 'Aceptado' },
        create: {
          id: `99999999-dddd-4999-8999-00000000001${i}`,
          userId: juanRamon.id,
          type,
          fileUrl: `https://res.cloudinary.com/demo/ryd-u/up230190-${type.toLowerCase()}.jpg`,
          status: 'Aceptado',
        },
      });
    }
    console.log(`Documentos aceptados para ${juanRamon.email}: ${tiposDocumento.length}`);
  }

  console.log('Seed completado:');
  console.log(`  ${roleNames.length} roles, ${usuarios.length} usuarios, ${vehiculos.length} vehículos`);
  console.log(`  ${rutas.length} rutas, ${viajes.length} viajes, ${solicitudes.length} solicitudes`);
  console.log(`  ${calificaciones.length} calificaciones, ${notificaciones.length} notificaciones, ${documentos.length} documentos`);
  console.log(`  Contraseña de todos los usuarios de prueba: ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
