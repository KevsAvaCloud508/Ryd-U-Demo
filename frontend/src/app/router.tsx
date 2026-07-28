import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { LandingPage } from '../pages/LandingPage';
import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverRequestsPage } from '../features/driver/pages/RequestsPage';
import { DriverProfilePage } from '../features/driver/pages/ProfilePage';
import { ProtectedRoute } from '../shared/routes/ProtectedRoute';

/**
 * Router raíz de la aplicación.
 */
export const router = createBrowserRouter([
  // Rutas públicas
  { path: '/', element: <LandingPage /> },
  { path: '/acceso', element: <LoginPage /> },
  { path: '/registro', element: <SignupPage /> },

  // Rutas protegidas - Conductor
  {
    path: '/conductor',
    element: <ProtectedRoute allowedRoles={['DRIVER']} />,
    children: [
      { path: 'perfil', element: <DriverProfilePage /> },
    ],
  },
  {
    path: '/conductor',
    element: <DriverLayout />,
    children: [
      { path: 'solicitudes', element: <DriverRequestsPage /> },
    ],
  },
]);
