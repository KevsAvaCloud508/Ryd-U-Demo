import dotenv from 'dotenv';

// Carga las variables definidas en el archivo .env hacia process.env.
dotenv.config();

/**
 * Configuración centralizada de la aplicación.
 * Lee las variables de entorno y expone valores tipados con defaults seguros.
 */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
