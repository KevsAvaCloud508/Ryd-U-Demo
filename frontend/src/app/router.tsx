import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { VerificationPage } from '../features/verification/pages/VerificationPage';
import { PassengerHomePage } from '../features/passengers/pages/HomePage';
import { PassengerSearchPage } from '../features/passengers/pages/SearchPage';
import { PassengerActivityPage } from '../features/passengers/pages/ActivityPage';
import { PassengerProfilePage } from '../features/passengers/pages/ProfilePage';
import { DriverProfilePage } from '../features/drivers/pages/ProfilePage';
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
  { path: '/pasajero/actividad-preview', element: <PassengerActivityPage /> },

  // Rutas protegidas - Pasajero
  {
    path: '/pasajero',
    element: <ProtectedRoute allowedRoles={['STUDENT']} />,
    children: [
      { path: 'inicio', element: <PassengerHomePage /> },
      { path: 'buscar', element: <PassengerSearchPage /> },
      { path: 'actividad', element: <PassengerActivityPage /> },
      { path: 'perfil', element: <PassengerProfilePage /> },
    ],
  },

  // Rutas protegidas - Conductor
  {
    path: '/conductor',
    element: <ProtectedRoute allowedRoles={['DRIVER']} />,
    children: [
      { path: 'perfil', element: <DriverProfilePage /> },
    ],
  },
]);
