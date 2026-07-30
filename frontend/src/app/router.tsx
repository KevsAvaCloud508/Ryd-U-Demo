import { createBrowserRouter } from 'react-router-dom';

import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverDashboardPage } from '../features/driver/pages/DashboardPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { LandingPage } from '../pages/LandingPage';
import { DriverRequestsPage } from '../features/driver/pages/RequestsPage';
import { DriverRoutesPage } from '../features/driver/pages/RoutesPage';
import { DriverVerificationPage } from '../features/driver/pages/VerificationPage';
import { DriverEarningsPage } from '../features/driver/pages/EarningsPage';
import { DriverProfilePage } from '../features/driver/pages/ProfilePage';
import { PassengerHomePage } from '../features/passenger/pages/PassengerHomePage';
import { VerificationPage } from '../features/verification/pages/VerificationPage';
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
      {
        element: <DriverLayout />,
        children: [
          { path: 'solicitudes', element: <DriverRequestsPage /> },
          { path: 'rutas', element: <DriverRoutesPage /> },
          { path: 'panel', element: <DriverDashboardPage /> },
          { path: 'validacion', element: <DriverVerificationPage /> },
          { path: 'ganancias', element: <DriverEarningsPage /> },
          { path: 'perfil', element: <DriverProfilePage /> },
        ],
      },
    ],
  },

  // Rutas protegidas - Pasajero
  {
    path: '/pasajero/inicio',
    element: <ProtectedRoute allowedRoles={['STUDENT']} />,
    children: [
      { index: true, element: <PassengerHomePage /> },
    ],
  },
  {
    path: '/pasajero/validacion',
    element: <ProtectedRoute allowedRoles={['STUDENT']} />,
    children: [
      { index: true, element: <VerificationPage /> },
    ],
  },
]);
