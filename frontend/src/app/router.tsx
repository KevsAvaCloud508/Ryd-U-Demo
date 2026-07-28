import { createBrowserRouter } from 'react-router-dom';

import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverDashboardPage } from '../features/driver/pages/DashboardPage';

/**
 * Router raíz de la aplicación.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Ryd-U</div>,
  },
  {
    path: '/conductor',
    element: <DriverLayout />,
    children: [
      { path: 'panel', element: <DriverDashboardPage /> },
    ],
  },
]);
