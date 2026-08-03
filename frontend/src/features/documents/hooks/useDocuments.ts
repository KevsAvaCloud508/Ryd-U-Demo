import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import { loadDocuments, uploadDoc, removeDoc, approveDemoDocuments } from '../store/documents.slice';
import type { DocumentType } from '../types/documents.types';

/**
 * Hook para gestionar documentos de verificacion del usuario.
 * Expone acciones para cargar, subir, eliminar y aprobar documentos.
 */
export function useDocuments() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.documents);

  /** Carga todos los documentos del usuario. */
  const load = useCallback(() => dispatch(loadDocuments()).unwrap(), [dispatch]);

  /** Sube un archivo real a Cloudinary via multipart. */
  const upload = useCallback(
    (type: DocumentType, file: File) => dispatch(uploadDoc({ type, file })).unwrap(),
    [dispatch],
  );

  /** Elimina un documento por ID. */
  const remove = useCallback(
    (documentId: string) => dispatch(removeDoc(documentId)).unwrap(),
    [dispatch],
  );

  /** Aprueba los documentos en modo demo (no-op en modo real). */
  const approveAll = useCallback(() => dispatch(approveDemoDocuments()).unwrap(), [dispatch]);

  return {
    documents: items,
    isLoading: status === 'loading',
    status,
    error,
    load,
    upload,
    remove,
    approveAll,
  };
}
