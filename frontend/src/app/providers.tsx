import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { store } from './store';

/**
 * Componente que envuelve la aplicación con todos los providers globales:
 * el store de Redux y el router. Es el único punto donde se cablean estas
 * dependencias de infraestructura.
 */
export function Providers() {
  return (
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  );
}
