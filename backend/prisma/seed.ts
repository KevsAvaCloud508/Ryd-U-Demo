import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Seeding database …');

  // ── 1. Crear roles ──────────────────────────────────────────
  const roles = [
    { id: 1, name: 'Pasajero' },
    { id: 2, name: 'Conductor' },
    { id: 3, name: 'Administrador' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: { id: role.id, name: role.name },
    });
  }
  console.log('  ✅ Roles creados: Pasajero, Conductor, Administrador');

  // ── 2. Crear usuario admin ──────────────────────────────────
  const adminEmail = 'admin@alumnos.upa.edu.mx';
  const adminPassword = 'Admin1234';
  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      firstName: 'Admin',
      lastNamePaternal: 'RydU',
      passwordHash,
    },
    create: {
      firstName: 'Admin',
      lastNamePaternal: 'RydU',
      email: adminEmail,
      passwordHash,
      isActive: true,
    },
  });
  console.log(`  ✅ Admin creado: ${adminEmail} / ${adminPassword}`);

  // ── 3. Asignar rol Administrador al admin ───────────────────
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: 3 } },
    update: {},
    create: { userId: admin.id, roleId: 3 },
  });
  console.log('  ✅ Rol Administrador asignado al admin');

  // ── 4. Crear usuario de prueba — Conductor ──────────────
  const driverEmail = 'conductor@alumnos.upa.edu.mx';
  const driverPassword = 'Conductor123';
  const driverHash = await bcrypt.hash(driverPassword, SALT_ROUNDS);

  const driver = await prisma.user.upsert({
    where: { email: driverEmail },
    update: {
      firstName: 'Carlos',
      lastNamePaternal: 'Vega',
      passwordHash: driverHash,
    },
    create: {
      firstName: 'Carlos',
      lastNamePaternal: 'Vega',
      email: driverEmail,
      passwordHash: driverHash,
      isActive: true,
    },
  });
  console.log(`  ✅ Conductor creado: ${driverEmail} / ${driverPassword}`);

  // ── 5. Asignar rol Conductor ─────────────────────────────
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: driver.id, roleId: 2 } },
    update: {},
    create: { userId: driver.id, roleId: 2 },
  });
  console.log('  ✅ Rol Conductor asignado');

  // ── 6. Crear usuario de prueba — Pasajero ────────────────
  const passengerEmail = 'pasajero@alumnos.upa.edu.mx';
  const passengerPassword = 'Pasajero123';
  const passengerHash = await bcrypt.hash(passengerPassword, SALT_ROUNDS);

  const passenger = await prisma.user.upsert({
    where: { email: passengerEmail },
    update: {
      firstName: 'María',
      lastNamePaternal: 'García',
      passwordHash: passengerHash,
    },
    create: {
      firstName: 'María',
      lastNamePaternal: 'García',
      email: passengerEmail,
      passwordHash: passengerHash,
      isActive: true,
    },
  });
  console.log(`  ✅ Pasajero creado: ${passengerEmail} / ${passengerPassword}`);

  // ── 7. Asignar rol Pasajero ──────────────────────────────
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: passenger.id, roleId: 1 } },
    update: {},
    create: { userId: passenger.id, roleId: 1 },
  });
  console.log('  ✅ Rol Pasajero asignado');

  console.log('🌱 Seed completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
