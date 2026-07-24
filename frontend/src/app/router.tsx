import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { VerificationPage } from '../features/verification/pages/VerificationPage';
import { PassengerHomePage } from '../features/passengers/pages/HomePage';
import { PassengerSearchPage } from '../features/passengers/pages/SearchPage';
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
  { path: '/pasajero/inicio-preview', element: <PassengerHomePage /> },
  { path: '/pasajero/buscar-preview', element: <PassengerSearchPage /> },

  // Rutas protegidas - Pasajero
  {
    path: '/pasajero',
    element: <ProtectedRoute allowedRoles={['STUDENT']} />,
    children: [
      { path: 'inicio', element: <PassengerHomePage /> },
      { path: 'buscar', element: <PassengerSearchPage /> },
    ],
  },
]);
