import { createBrowserRouter } from 'react-router-dom';

import { SignupPage } from '../features/auth/pages/SignupPage';
import { LandingPage } from '../pages/LandingPage';

/**
 * Router raíz de la aplicación.
 */
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/registro', element: <SignupPage /> },
]);
