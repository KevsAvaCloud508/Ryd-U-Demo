import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { VerificationPage } from '../features/verification/pages/VerificationPage';
import { PassengerHomePage } from '../features/passengers/pages/HomePage';
import { LandingPage } from '../pages/LandingPage';
import { ProtectedRoute } from '../shared/routes/ProtectedRoute';

/**
 * Router raíz de la aplicación.
 */
export const router = createBrowserRouter([
  // Rutas públicas
  { path: '/', element: <LandingPage /> },
  { path: '/acceso', element: <LoginPage /> },
  { path: '/registro', element: <SignupPage /> },
  { path: '/pasajero/validacion', element: <VerificationPage /> },
  { path: '/pasajero/inicio-preview', element: <PassengerHomePage /> }, // preview ya que esta protegida la principal

  // Rutas protegidas - Pasajero
  {
    path: '/pasajero',
    element: <ProtectedRoute allowedRoles={['STUDENT']} />,
    children: [
      { path: 'inicio', element: <PassengerHomePage /> },
    ],
  },
]);
