import { createBrowserRouter } from 'react-router-dom';

import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverEarningsPage } from '../features/driver/pages/EarningsPage';

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
      { path: 'ganancias', element: <DriverEarningsPage /> },
    ],
  },
]);
