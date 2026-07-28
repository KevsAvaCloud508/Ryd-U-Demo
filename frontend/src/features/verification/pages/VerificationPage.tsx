import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, Button, Card, Pill } from '../../../shared/components';

// Estado de cada documento requerido
interface DocumentStatus {
  id: string;
  icon: string;
  label: string;
  hint: string;
  uploaded: boolean;
}

// Vista P1 · Validación de documentos — verificación de identidad del pasajero
export function VerificationPage() {
  const [documents, setDocuments] = useState<DocumentStatus[]>([
    { id: 'ine', icon: 'bi-person-vcard', label: 'Identificación oficial (INE)', hint: 'Frente y reverso', uploaded: true },
    { id: 'student-id', icon: 'bi-mortarboard', label: 'Credencial de estudiante', hint: 'Vigente', uploaded: false },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const toggleDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, uploaded: !doc.uploaded } : doc)),
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Lógica futura: procesar archivos
  };

  const handleFileSelect = () => {
    // Lógica futura: abrir selector de archivos
  };

  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      {/* Barra superior — responsiva */}
      <div className="flex h-14 items-center gap-2 border-b border-line px-4 sm:h-16 sm:gap-4 sm:px-5 lg:gap-6 lg:px-7">
        <Link to="/">
          <img className="h-5 w-auto sm:h-6" src="/logo.svg" alt="RydU" />
        </Link>
        <div className="flex gap-3 text-sm font-semibold text-muted sm:gap-[22px]">
          <a className="text-white">Verificación</a>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Pill variant="dark" className="hidden sm:inline-flex">
            <i className="bi bi-person-walking" /> Pasajero
          </Pill>
          {/* En mobile y tablet solo el icono del rol */}
          <span className="inline-flex sm:hidden items-center gap-1 rounded-full bg-surface3 px-2.5 py-1 text-[11px] font-extrabold text-[#e5e5ea]">
            <i className="bi bi-person-walking" />
          </span>
          <Avatar initial="E" size={32} className="sm:w-[38px] sm:h-[38px]" />
        </div>
      </div>

      {/* Contenido principal — responsivo */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-6 px-5 py-8 sm:gap-8 sm:px-8 sm:py-10 lg:grid-cols-2 lg:items-center lg:gap-[30px] lg:px-12 lg:py-11">
        {/* Columna izquierda — información */}
        <div className="order-1 lg:order-none">
          <Pill variant="outline">
            <i className="bi bi-hourglass-split" /> Cuenta en revisión
          </Pill>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:mt-3.5 sm:text-[26px] lg:text-[28px]">
            Verifica tu identidad
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            Para proteger la comunidad, sube una fotografía legible de los siguientes
            documentos. El pasajero <strong className="text-white">no</strong> requiere
            documentos vehiculares.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
            <Pill variant="dark">
              <i className="bi bi-shield-lock" /> Cifrado
            </Pill>
            <Pill variant="dark">
              <i className="bi bi-eye-slash" /> Uso interno
            </Pill>
            <Pill variant="dark">
              <i className="bi bi-clock" /> Revisión ~24h
            </Pill>
          </div>
        </div>

        {/* Columna derecha — documentos + upload */}
        <div className="order-2 lg:order-none">
          {/* Lista de documentos requeridos */}
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="mb-2.5 flex items-center gap-3 rounded-[14px] border border-line bg-surface px-3.5 py-3 sm:gap-3 sm:px-4 sm:py-3.5 lg:mb-3"
            >
              <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-surface2 text-base sm:h-[38px] sm:w-[38px] sm:text-[17px]">
                <i className={`bi ${doc.icon}`} />
              </span>
              <div className="min-w-0 flex-1">
                <b className="text-sm text-white">{doc.label}</b>
                <div className="truncate text-xs text-muted">{doc.hint}</div>
              </div>
              {doc.uploaded ? (
                <button
                  type="button"
                  onClick={() => toggleDocument(doc.id)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-black transition-opacity hover:opacity-80 sm:px-3"
                >
                  <i className="bi bi-check2" /> <span className="hidden sm:inline">Subido</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleDocument(doc.id)}
                  className="shrink-0 text-[20px] text-muted transition-colors hover:text-white"
                >
                  <i className="bi bi-plus-circle" />
                </button>
              )}
            </div>
          ))}

          {/* Zona de arrastrar y soltar */}
          <Card
            dashed
            role="button"
            tabIndex={0}
            className={`cursor-pointer border-2 p-5 text-center transition-all duration-200 sm:p-[22px] lg:p-[26px] ${
              isDragging
                ? 'border-white bg-surface2'
                : 'border-line bg-transparent hover:border-white/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileSelect}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFileSelect();
              }
            }}
          >
            <i className="bi bi-cloud-arrow-up text-2xl text-white sm:text-[26px] lg:text-[28px]" />
            <div className="mt-2 text-[13px] text-muted">
              Arrastra tus archivos aquí o{' '}
              <span className="font-bold text-white">selecciona</span>
            </div>
          </Card>

          {/* Botón de envío — oculto en mobile, visible en desktop */}
          <Button fullWidth className="mt-3.5 hidden lg:flex sm:mt-4">
            Enviar para revisión <i className="bi bi-arrow-right" />
          </Button>
        </div>
      </div>

      {/* Barra inferior fija en mobile con CTA rápida */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-black/95 p-4 backdrop-blur-sm lg:hidden">
        <Button fullWidth>
          Enviar para revisión <i className="bi bi-arrow-right" />
        </Button>
      </div>
      <div className="lg:hidden h-[76px]" />
    </div>
  );
}
