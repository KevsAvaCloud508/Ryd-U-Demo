import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import { loadDocuments, removeDoc, uploadDoc } from '../store/documents.slice';
import type { DocumentType } from '../types/documents.types';

export function useDocuments() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.documents);

  const load = useCallback(() => dispatch(loadDocuments()).unwrap(), [dispatch]);
  const upload = useCallback((type: DocumentType, file: File) => dispatch(uploadDoc({ file, type })).unwrap(), [dispatch]);
  const remove = useCallback((documentId: string) => dispatch(removeDoc(documentId)).unwrap(), [dispatch]);

  return {
    documents: items,
    isLoading: status === 'loading',
    error,
    load,
    upload,
    remove,
  };
}
