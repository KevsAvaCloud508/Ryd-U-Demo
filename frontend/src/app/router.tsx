import { createBrowserRouter } from 'react-router-dom';

/**
 * Router raíz de la aplicación.
 *
 * Todavía no hay ninguna vista implementada: solo una ruta placeholder para
 * confirmar que el enrutamiento funciona. Cada feature añadirá sus propias
 * rutas aquí a medida que se desarrolle.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Ryd-U</div>,
  },
]);
