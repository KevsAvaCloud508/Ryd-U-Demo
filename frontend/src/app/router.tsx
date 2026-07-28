import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { VerificationPage } from '../features/verification/pages/VerificationPage';
import { LandingPage } from '../pages/LandingPage';
import { ProtectedRoute } from '../shared/routes/ProtectedRoute';
import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverProfilePage } from '../features/driver/pages/ProfilePage';

/**
 * Router raíz de la aplicación.
 */
export const router = createBrowserRouter([
  // Rutas públicas
  { path: '/', element: <LandingPage /> },
  { path: '/acceso', element: <LoginPage /> },
  { path: '/registro', element: <SignupPage /> },

  // Vistas de conductor (con sidebar y navegación)
  {
    path: '/conductor',
    element: <DriverLayout />,
    children: [
      { path: 'perfil', element: <DriverProfilePage /> },
    ],
  },
]);
