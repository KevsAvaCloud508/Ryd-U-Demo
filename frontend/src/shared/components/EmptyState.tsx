import type { ReactNode } from 'react';

import { Card } from './Card';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

// Estado vacío reutilizable (icono + título + descripción + acción opcional).
export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <Card dashed className={`p-10 text-center ${className}`}>
      <i className={`bi ${icon} text-4xl text-muted`} />
      <h2 className="mt-3 text-xl font-extrabold text-white">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}
