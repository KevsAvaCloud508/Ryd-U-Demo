import { useEffect, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Navbar, Pill } from '../../../shared/components';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { useDocuments } from '../../documents/hooks/useDocuments';
import { useToast } from '../../../shared/toast/ToastProvider';
import { roleHomePath } from '../../../shared/routes/role-paths';
import type { DocumentType } from '../../documents/types/documents.types';

const REQUIRED_DOCS: { type: DocumentType; label: string; icon: string; description: string }[] = [
  { type: 'INE', label: 'Identificacion oficial (INE)', icon: 'bi-person-vcard', description: 'Frente y reverso' },
  { type: 'CredencialEstudiante', label: 'Credencial de estudiante', icon: 'bi-mortarboard', description: 'Vigente' },
];

// Vista P1 - Validacion de documentos del pasajero
export function VerificationPage() {
  const { documents, load, upload, approveAll } = useDocuments();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>({
    INE: null,
    LicenciaConduccion: null,
    CredencialEstudiante: null,
    PolizaVigente: null,
  });

  useEffect(() => {
    load();
  }, [load]);

  const isDocUploaded = (type: DocumentType): boolean => {
    const doc = documents.find((d) => d.type === type);
    return doc?.status === 'Pendiente' || doc?.status === 'Aceptado';
  };

  const getDocStatus = (type: DocumentType) => {
    const doc = documents.find((d) => d.type === type);
    return doc?.status ?? null;
  };

  const triggerFileInput = (type: DocumentType) => {
    if (isDocUploaded(type)) return;
    fileInputRefs.current[type]?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('El archivo no puede superar 5MB.', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Solo se permiten archivos JPG, PNG, WebP o PDF.', 'error');
      return;
    }

    try {
      await upload(type, file);
      showToast('Documento subido correctamente.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al subir el documento.', 'error');
    } finally {
      e.target.value = '';
    }
  };

  const handleSendForReview = async () => {
    // En modo demo se marcan como Aceptados (acceso completo); en real es no-op.
    try {
      await approveAll();
    } catch {
      // Si la aprobación demo falla, el acceso aún se evalúa por los documentos subidos.
    }
    showToast('¡Verificación aprobada! Tus documentos fueron revisados y aprobados.', 'success');
    navigate(roleHomePath.STUDENT);
  };

  const handlePostpone = () => {
    showToast('Verificacion pospuesta. Solo podras ver tu perfil hasta completar la verificacion.', 'info');
    navigate('/pasajero/perfil');
  };

  const allDocsUploaded = REQUIRED_DOCS.every((doc) => isDocUploaded(doc.type));
  const allDocsAccepted = REQUIRED_DOCS.every((doc) => getDocStatus(doc.type) === 'Aceptado');
  const hasRejected = REQUIRED_DOCS.some((doc) => getDocStatus(doc.type) === 'Rechazado');
  const uploadedCount = REQUIRED_DOCS.filter((doc) => isDocUploaded(doc.type)).length;

  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      <Navbar
        links={[{ label: 'Verificacion', href: '/pasajero/validacion', active: true }]}
        right={
          <>
            <Pill variant="dark">
              <i className="bi bi-person-walking" /> Pasajero
            </Pill>
            <NotificationBell />
            <Avatar initial="E" />
          </>
        }
      />
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 items-center gap-[30px] px-12 py-11">
        {/* Columna izquierda - Info */}
        <div>
          <Pill variant="outline">
            <i className="bi bi-hourglass-split" /> Cuenta en revision
          </Pill>
          <h2 className="my-3.5 text-[28px] tracking-tight text-white">Verifica tu identidad</h2>
          <p className="text-[15px] leading-relaxed text-muted">
            Para proteger la comunidad, sube una fotografia legible de los siguientes documentos. El pasajero{' '}
            <b className="text-white">no</b> requiere documentos vehiculares.
          </p>
          <div className="mt-5 flex gap-2.5">
            <Pill variant="dark"><i className="bi bi-shield-lock" /> Cifrado</Pill>
            <Pill variant="dark"><i className="bi bi-eye-slash" /> Uso interno</Pill>
            <Pill variant="dark"><i className="bi bi-clock" /> Revision ~24h</Pill>
          </div>
        </div>

        {/* Columna derecha - Documentos y acciones */}
        <div>
          {/* Documentos requeridos */}
          {REQUIRED_DOCS.map(({ type, label, icon, description }) => {
            const uploaded = isDocUploaded(type);
            const status = getDocStatus(type);

            return (
              <div key={type} className={`mb-3 cursor-pointer ${uploaded ? '' : 'hover:opacity-90'}`} onClick={() => triggerFileInput(type)}>
                <Card className={`p-4 ${uploaded ? 'border-green-400/30' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${uploaded ? 'bg-green-400/10' : 'bg-surface'}`}>
                        <i className={`bi ${icon} ${uploaded ? 'text-green-400' : 'text-muted'}`} />
                      </div>
                      <div>
                        <b className="text-[13px] text-white">{label}</b>
                        <div className="text-[11px] text-muted">{description}</div>
                      </div>
                    </div>
                    {uploaded ? (
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <i className="bi bi-check-circle-fill" />
                        {status === 'Aceptado' ? 'Aceptado' : 'Enviado'}
                      </span>
                    ) : (
                      <i className="bi bi-cloud-arrow-up text-muted" />
                    )}
                  </div>
                </Card>
                <input
                  ref={(el) => { fileInputRefs.current[type] = el; }}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                  onChange={(e) => handleFileChange(e, type)}
                  className="hidden"
                />
              </div>
            );
          })}

          {/* Card informativa */}
          <Card dashed className="mb-4 p-5 text-center">
            <i className="bi bi-cloud-arrow-up text-[28px] text-white" />
            <div className="mt-2 text-[13px] text-muted">
              Haz clic en un documento para seleccionar el archivo
            </div>
            <div className="mt-1 text-[11px] text-muted">Maximo 5MB - JPG, PNG, WebP, PDF</div>
          </Card>

          {/* Acciones */}
          {allDocsAccepted ? (
            <Card className="p-5 text-center">
              <i className="bi bi-check-circle-fill text-[28px] text-green-400" />
              <p className="mt-2 text-sm text-white font-semibold">Documentos verificados</p>
              <p className="mt-1 text-xs text-muted">Ya puedes usar la plataforma completa.</p>
              <Button className="mt-4" onClick={() => navigate('/pasajero/inicio')}>
                <i className="bi bi-house mr-2" /> Ir al inicio
              </Button>
            </Card>
          ) : hasRejected ? (
            <Card className="p-5 text-center border-red-400/30">
              <i className="bi bi-exclamation-triangle text-[28px] text-red-400" />
              <p className="mt-2 text-sm text-white font-semibold">Documentos rechazados</p>
              <p className="mt-1 text-xs text-muted">Sube los documentos nuevamente.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              <Button fullWidth disabled={!allDocsUploaded} onClick={() => void handleSendForReview()}>
                <i className="bi bi-send mr-2" />
                {allDocsUploaded ? 'Enviar para revision' : `Sube ${REQUIRED_DOCS.length - uploadedCount} documento(s) mas`}
              </Button>
              <Button fullWidth variant="ghost" onClick={handlePostpone}>
                <i className="bi bi-calendar-x mr-2" /> Posponer verificacion
              </Button>
              {!allDocsUploaded && (
                <p className="text-center text-[11px] text-muted">
                  La verificacion es necesaria para usar todos los servicios.
                  Mientras tanto, solo podras ver tu perfil.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
