import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDocuments } from '../../features/documents/hooks/useDocuments';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { roleVerificationPath } from './role-paths';

const PASSENGER_REQUIRED_DOCS = ['INE', 'CredencialEstudiante'];

interface VerificationGuardProps {
  allowedWithoutVerification?: string[];
}

/**
 * Guard que restringe el acceso a rutas que no sean perfil o validacion
 * si el usuario no ha subido sus documentos de verificacion.
 * Espera a que los documentos se carguen antes de decidir (evita redirigir
 * antes de que el store tenga los datos). En modo demo los documentos se
 * persisten en localStorage, así que la misma lógica aplica en ambos modos.
 */
export function VerificationGuard({ allowedWithoutVerification = [] }: VerificationGuardProps) {
  const { role } = useAuth();
  const { documents, load, status } = useDocuments();
  const location = useLocation();

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  // Las rutas permitidas (perfil, validacion) son accesibles siempre, sin
  // esperar la carga de documentos ni redirigir.
  const isAllowedPath = allowedWithoutVerification.some((path) => location.pathname.startsWith(path));
  if (isAllowedPath) {
    return <Outlet />;
  }

  // Aún no sabemos si el usuario tiene documentos: no decidir todavía.
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-muted">
        Cargando verificación…
      </div>
    );
  }

  const hasAllDocs = PASSENGER_REQUIRED_DOCS.every((type) => {
    const doc = documents.find((d) => d.type === type);
    return doc?.status === 'Pendiente' || doc?.status === 'Aceptado';
  });

  if (hasAllDocs) {
    return <Outlet />;
  }

  if (role) {
    return <Navigate to={roleVerificationPath[role]} replace />;
  }

  return <Navigate to="/" replace />;
}
