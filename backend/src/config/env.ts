import path from 'node:path';

import dotenv from 'dotenv';

// Carga las variables definidas en el archivo .env hacia process.env.
dotenv.config();

const port = Number(process.env.PORT ?? 4000);

/**
 * Configuración centralizada de la aplicación.
 * Lee las variables de entorno y expone valores tipados con defaults seguros.
 * No abre conexiones ni contiene lógica de negocio.
 */
export const env = {
  port,
  // URL pública del backend: se usa para construir las URLs absolutas de los
  // archivos subidos a disco local (servidos desde /uploads).
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? `http://localhost:${port}`,
  // Carpeta donde se guardan los archivos subidos cuando no hay Cloudinary.
  uploadsDir: path.resolve(process.env.UPLOADS_DIR ?? 'uploads'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  // Cloudinary - para subida real de archivos
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
} as const;
