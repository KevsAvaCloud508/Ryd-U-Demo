import type { ReactNode } from 'react';

interface ListRowProps {
  icon: ReactNode;
  label: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}

// Fila de opción dentro de una lista de configuración (equivalente a .listrow del mockup)
export function ListRow({ icon, label, trailing, onClick }: ListRowProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {trailing ?? <i className="bi bi-chevron-right text-muted" />}
    </div>
  );
}

// Línea separadora entre filas (equivalente a .divider del mockup)
export function Divider() {
  return <div className="h-px bg-line" />;
}
