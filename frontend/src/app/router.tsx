import { createBrowserRouter } from 'react-router-dom';

import { DriverLayout } from '../features/driver/layout/DriverLayout';
import { DriverPublishRoutePage } from '../features/driver/pages/PublishRoutePage';

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
      { path: 'publicar-ruta', element: <DriverPublishRoutePage /> },
    ],
  },
]);
