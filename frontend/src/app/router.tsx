import { createBrowserRouter } from 'react-router-dom';

import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverDashboardPage } from '../features/driver/pages/DashboardPage';

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
  {
    path: '/conductor',
    element: <DriverLayout />,
    children: [
      { path: 'panel', element: <DriverDashboardPage /> },
    ],
  },
]);
