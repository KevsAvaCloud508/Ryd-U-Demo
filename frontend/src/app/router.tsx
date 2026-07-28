import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { VerificationPage } from '../features/verification/pages/VerificationPage';
import { LandingPage } from '../pages/LandingPage';
import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverVerificationPage } from '../features/driver/pages/VerificationPage';

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
      { path: 'validacion', element: <DriverVerificationPage /> },
    ],
  },
]);
