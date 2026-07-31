import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { LandingPage } from '../pages/LandingPage';
import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverProfilePage } from '../features/driver/pages/ProfilePage';
import { DProfileVehiclePage } from '../features/driver/pages/VehiclePage';
import { DProfileDocumentsPage } from '../features/driver/pages/DocumentsPage';
import { DProfileAccountPage } from '../features/driver/pages/AccountPage';
import { DProfileNotificationsPage } from '../features/driver/pages/NotificationsPage';
import { DProfileSecurityPage } from '../features/driver/pages/SecurityPage';

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
      { path: 'perfil/vehiculo', element: <DProfileVehiclePage /> },
      { path: 'perfil/documentos', element: <DProfileDocumentsPage /> },
      { path: 'perfil/cuenta', element: <DProfileAccountPage /> },
      { path: 'perfil/notificaciones', element: <DProfileNotificationsPage /> },
      { path: 'perfil/seguridad', element: <DProfileSecurityPage /> },
    ],
  },
]);
