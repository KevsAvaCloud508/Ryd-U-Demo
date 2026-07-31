import type { ReactNode } from 'react';

interface FieldLabelProps {
  children: ReactNode;
  className?: string;
  // Tamaño de la etiqueta: sm (por defecto) o md (para formularios más grandes).
  size?: 'sm' | 'md';
}

// Etiqueta pequeña sobre un input
export function FieldLabel({ children, className = '', size = 'sm' }: FieldLabelProps) {
  const sizeClass = size === 'md' ? 'text-sm' : 'text-xs';
  return <div className={`my-[14px] mb-1.5 font-semibold text-muted ${sizeClass} ${className}`}>{children}</div>;
}
