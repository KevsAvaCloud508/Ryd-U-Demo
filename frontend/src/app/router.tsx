import { createBrowserRouter } from 'react-router-dom';

import { LandingPage } from '../pages/LandingPage';

/**
 * Router raíz de la aplicación.
 */
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
]);
