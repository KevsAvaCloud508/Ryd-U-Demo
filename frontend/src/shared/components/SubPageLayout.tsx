import type { ReactNode } from 'react';

import { BackButton } from './BackButton';
import { PageHeader } from './PageHeader';

interface SubPageLayoutProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backTo?: string;
  backLabel?: string;
  children: ReactNode;
}

// Estructura común de las subpáginas de perfil: contenedor, botón de regreso y encabezado.
// Por defecto regresa al perfil del conductor, que es su único uso actual.
export function SubPageLayout({
  title,
  subtitle,
  action,
  backTo = '/conductor/perfil',
  backLabel = 'Perfil',
  children,
}: SubPageLayoutProps) {
  return (
    <div className="px-10 pb-10">
      <BackButton to={backTo} label={backLabel} />
      <PageHeader title={title} subtitle={subtitle} action={action} compact />
      {children}
    </div>
  );
}
