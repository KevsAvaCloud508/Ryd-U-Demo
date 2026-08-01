import { createBrowserRouter } from 'react-router-dom';

import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverDashboardPage } from '../features/driver/pages/DashboardPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { LandingPage } from '../pages/LandingPage';
import { DriverRequestsPage } from '../features/driver/pages/RequestsPage';
import { DriverRoutesPage } from '../features/driver/pages/RoutesPage';
import { DriverVerificationPage } from '../features/driver/pages/VerificationPage';
import { DriverEarningsPage } from '../features/driver/pages/EarningsPage';
import { DriverProfilePage } from '../features/driver/pages/ProfilePage';
import { DProfileVehiclePage } from '../features/driver/pages/VehiclePage';
import { DProfileDocumentsPage } from '../features/driver/pages/DocumentsPage';
import { DProfileAccountPage } from '../features/driver/pages/AccountPage';
import { DProfileNotificationsPage } from '../features/driver/pages/NotificationsPage';
import { DProfileSecurityPage } from '../features/driver/pages/SecurityPage';
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
  { path: '/olvidar-contrasena', element: <ForgotPasswordPage /> },

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
          { path: 'perfil/vehiculo', element: <DProfileVehiclePage /> },
          { path: 'perfil/documentos', element: <DProfileDocumentsPage /> },
          { path: 'perfil/cuenta', element: <DProfileAccountPage /> },
          { path: 'perfil/notificaciones', element: <DProfileNotificationsPage /> },
          { path: 'perfil/seguridad', element: <DProfileSecurityPage /> },
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
