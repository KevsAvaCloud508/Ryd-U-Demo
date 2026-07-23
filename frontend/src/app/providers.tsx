import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { ToastProvider } from '../shared/toast/ToastProvider';
import { router } from './router';
import { store } from './store';

/**
 * Componente que envuelve la aplicación con todos los providers globales:
 * el store de Redux y el router.
 */
export function Providers() {
  return (
    <ReduxProvider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ReduxProvider>
  );
}
