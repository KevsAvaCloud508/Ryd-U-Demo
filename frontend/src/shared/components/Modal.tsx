import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

// Modal genérico reutilizable: overlay oscuro + panel centrado (equivalente a un .modal del mockup).
export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-[18px] border border-line bg-surface p-6 text-[#e5e7eb]"
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold tracking-tight text-white">{title}</h3>
            <button type="button" onClick={onClose} className="text-muted" aria-label="Cerrar">
              <i className="bi bi-x-lg" />
            </button>
          </div>
        )}
        {!title && (
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted" aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
