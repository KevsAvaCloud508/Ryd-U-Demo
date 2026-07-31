import fs from 'node:fs';
import path from 'node:path';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

import { env } from '../../config/env.js';

// Cloudinary es opcional: solo se usa si las tres credenciales están en .env.
// Sin credenciales, los archivos se guardan en disco (env.uploadsDir) y se
// sirven estáticos desde /uploads (ver app.ts).
export const cloudinaryEnabled = Boolean(
  env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret,
);

if (cloudinaryEnabled) {
  // cloudinary.config() es un singleton - solo se puede llamar una vez.
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
}

// Cada archivo se organiza en carpetas segun el campo multipart que lo envía
// (documents, profiles, vehicles).
function folderFor(file: Express.Multer.File): 'profiles' | 'vehicles' | 'documents' {
  if (file.fieldname === 'profile' || file.fieldname === 'photo') return 'profiles';
  if (file.fieldname === 'vehicle') return 'vehicles';
  return 'documents';
}

const uniqueId = () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

// Storage engine que sube archivos directamente a Cloudinary.
function makeCloudinaryStorage(): multer.StorageEngine {
  return new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => ({
      folder: `rydu/${folderFor(file)}`,
      public_id: uniqueId(),
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1920, crop: 'limit' }, // Limitar dimensiones
        { quality: 'auto:good' }, // Compresion automatica
      ],
    }),
  });
}

// Storage engine en disco local (fallback sin Cloudinary).
function makeDiskStorage(): multer.StorageEngine {
  return multer.diskStorage({
    destination: (_req, file, cb) => {
      const dir = path.join(env.uploadsDir, folderFor(file));
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      cb(null, `${uniqueId()}${path.extname(file.originalname).toLowerCase()}`);
    },
  });
}

export function makeStorage(): multer.StorageEngine {
  return cloudinaryEnabled ? makeCloudinaryStorage() : makeDiskStorage();
}

/**
 * URL pública del archivo recién subido, lista para guardarse en la BD.
 * Con Cloudinary, multer-storage-cloudinary deja la URL en file.path;
 * en disco local se construye sobre PUBLIC_BASE_URL + /uploads.
 */
export function publicFileUrl(file: Express.Multer.File): string {
  if (cloudinaryEnabled) return file.path;
  return `${env.publicBaseUrl}/uploads/${folderFor(file)}/${file.filename}`;
}

// Filtro de archivos: solo permite imagenes y PDFs.
// Tamano maximo: 5MB.
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten JPG, PNG, WebP y PDF.`));
  }
};

/**
 * Middleware de multer para documentos de verificación.
 * - storage: Cloudinary si hay credenciales, disco local si no
 * - fileFilter: solo imagenes y PDFs
 * - limits: maximo 5MB por archivo
 */
export const uploadMiddleware = multer({
  storage: makeStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * Elimina el archivo físico asociado a una URL guardada en la BD.
 * Soporta URLs de Cloudinary y de /uploads local; cualquier otra URL
 * (datos del seed, data-URIs antiguos) se ignora sin error.
 */
export async function deleteUploadedFile(fileUrl: string): Promise<void> {
  try {
    if (fileUrl.includes('cloudinary.com')) {
      if (!cloudinaryEnabled) return;
      // Extraer public_id de la URL
      // Formato: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{public_id}.{format}
      const parts = fileUrl.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return;
      const publicId = parts.slice(uploadIndex + 2).join('/').replace(/\.[^.]+$/, '');
      await cloudinary.uploader.destroy(publicId);
      return;
    }

    const localPrefix = `${env.publicBaseUrl}/uploads/`;
    if (fileUrl.startsWith(localPrefix)) {
      const relative = path.normalize(fileUrl.slice(localPrefix.length));
      // Guard contra path traversal: solo rutas dentro de uploadsDir.
      if (relative.startsWith('..') || path.isAbsolute(relative)) return;
      await fs.promises.unlink(path.join(env.uploadsDir, relative));
    }
  } catch (error) {
    console.error('Error al eliminar archivo subido:', error);
    // No lanzamos error porque la eliminacion no es critica
  }
}
