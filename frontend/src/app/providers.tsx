import { type ReactNode, useEffect } from 'react';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { restoreSession } from '../features/auth/store/auth.slice';
import { ToastProvider } from '../shared/toast/ToastProvider';
import { router } from './router';
import { store, type AppDispatch } from './store';

// Al montar la app intenta restaurar la sesión a partir del token guardado, para
// que recargar la página no obligue a iniciar sesión de nuevo si el token sigue vigente.
function SessionBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return children;
}

/**
 * Componente que envuelve la aplicación con todos los providers globales:
 * el store de Redux y el router. Es el único punto donde se cablean estas
 * dependencias de infraestructura.
 */
export function Providers() {
  return (
    <ReduxProvider store={store}>
      <ToastProvider>
        <SessionBootstrap>
          <RouterProvider router={router} />
        </SessionBootstrap>
      </ToastProvider>
    </ReduxProvider>
  );
}
