import multer from 'multer';

import { makeStorage } from './upload.js';

// Filtro de archivos: solo permite imagenes (sin PDFs para fotos de perfil).
const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten JPG, PNG y WebP.`));
  }
};

/**
 * Middleware de multer para fotos de perfil.
 * Usa el mismo storage que los documentos (Cloudinary o disco local);
 * el campo 'photo' se guarda en la carpeta profiles.
 * Maximo 2MB para fotos de perfil.
 */
export const photoUploadMiddleware = multer({
  storage: makeStorage(),
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
