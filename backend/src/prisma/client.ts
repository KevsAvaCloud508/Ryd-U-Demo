import { PrismaClient } from '@prisma/client';

/**
 * Instancia única (singleton) del cliente de Prisma.
 *
 * La conexión a la base de datos es perezosa: Prisma solo se conecta cuando
 * se ejecuta la primera consulta, por lo que importar este módulo no abre
 * ninguna conexión todavía. Los repositorios de cada módulo usarán este cliente.
 */
export const prisma = new PrismaClient();
