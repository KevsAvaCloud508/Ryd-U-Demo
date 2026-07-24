import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../features/auth/hooks/useAuth';
import type { Role } from '../types/auth';
import { roleHomePath } from './role-paths';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

// Protege un grupo de rutas: exige sesión válida y, si se indican roles, restringe
// el acceso a ellos. Un usuario autenticado con el rol equivocado es redirigido a
// su propia sección en lugar de ver un error.
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, role } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-muted">
        Cargando sesión…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/acceso" state={{ from: location }} replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={roleHomePath[role]} replace />;
  }

  return <Outlet />;
}
