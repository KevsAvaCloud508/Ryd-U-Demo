import { useEffect, useRef, useState } from 'react';

import {
  Button,
  Card,
  ConfirmModal,
  ErrorState,
  LoadingState,
  SubPageLayout,
} from '../../../shared/components';
import { useToast } from '../../../shared/toast/ToastProvider';
import { useDocuments } from '../../documents/hooks/useDocuments';
import {
  DOCUMENT_LABELS,
  type DocumentType,
  type VerificationDocument,
} from '../../documents/types/documents.types';

const DOCUMENT_TYPES: DocumentType[] = ['INE', 'LicenciaConduccion', 'CredencialEstudiante', 'PolizaVigente'];

const DOCUMENT_ICONS: Record<DocumentType, string> = {
  INE: 'bi-person-vcard',
  LicenciaConduccion: 'bi-credit-card-2-front',
  CredencialEstudiante: 'bi-mortarboard',
  PolizaVigente: 'bi-shield-check',
};

const STATUS_STYLES: Record<VerificationDocument['status'], string> = {
  Pendiente: 'bg-[#3a2e1b] text-[#e5c07b]',
  Aceptado: 'bg-[#1e3a2e] text-[#7be39b]',
  Rechazado: 'bg-[#3a1e1e] text-[#e57b7b]',
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Vista de la opción "Documentos" del perfil del conductor.
// Reutiliza el store de documentos (listar, subir y eliminar).
export function DProfileDocumentsPage() {
  const { documents, isLoading, error, load, upload, remove } = useDocuments();
  const { showToast } = useToast();
  const fileInputRefs = useRef<Partial<Record<DocumentType, HTMLInputElement | null>>>({});
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [docToDelete, setDocToDelete] = useState<VerificationDocument | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const documentFor = (type: DocumentType) => documents.find((doc) => doc.type === type);

  const handleFileChange = async (type: DocumentType, file?: File) => {
    if (!file) return;
    setUploadingType(type);
    try {
      await upload(type, file);
      showToast('Documento subido correctamente.', 'success');
    } catch (err) {
      showToast(typeof err === 'string' && err ? err : 'No se pudo subir el documento.', 'error');
    } finally {
      setUploadingType(null);
      const input = fileInputRefs.current[type];
      if (input) input.value = '';
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      await remove(docToDelete.id);
      showToast('Documento eliminado.', 'success');
      setDocToDelete(null);
    } catch (err) {
      showToast(typeof err === 'string' && err ? err : 'No se pudo eliminar el documento.', 'error');
    }
  };

  return (
    <SubPageLayout
      title="Documentos"
      subtitle="Documentos de verificación de tu cuenta"
    >
      {isLoading && documents.length === 0 ? (
        <LoadingState label="Cargando documentos…" className="mt-8" />
      ) : error && documents.length === 0 ? (
        <ErrorState message={error} className="mt-8" />
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {DOCUMENT_TYPES.map((type) => {
            const doc = documentFor(type);
            return (
              <Card key={type} className="flex flex-wrap items-center gap-4 p-5">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-surface2 text-xl text-white">
                  <i className={`bi ${DOCUMENT_ICONS[type]}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <b className="text-[15px] text-white">{DOCUMENT_LABELS[type]}</b>
                  <div className="text-xs text-muted">
                    {doc ? `Subido el ${formatDate(doc.uploadedAt)}` : 'Aún no has subido este documento'}
                  </div>
                </div>
                {doc ? (
                  <>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold ${STATUS_STYLES[doc.status]}`}
                    >
                      <i
                        className={`bi ${
                          doc.status === 'Aceptado'
                            ? 'bi-check2-circle'
                            : doc.status === 'Pendiente'
                              ? 'bi-clock'
                              : 'bi-x-circle'
                        }`}
                      />
                      {doc.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDocToDelete(doc)}
                      className="text-lg text-muted transition-colors hover:text-red-400"
                      aria-label="Eliminar documento"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      ref={(el) => {
                        fileInputRefs.current[type] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(type, e.target.files?.[0])}
                    />
                    <Button
                      size="sm"
                      onClick={() => fileInputRefs.current[type]?.click()}
                      disabled={uploadingType === type}
                    >
                      {uploadingType === type ? (
                        <>
                          <i className="bi bi-arrow-repeat animate-spin" /> Subiendo…
                        </>
                      ) : (
                        <>
                          <i className="bi bi-upload" /> Subir
                        </>
                      )}
                    </Button>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(docToDelete)}
        title="¿Eliminar documento?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </SubPageLayout>
  );
}
