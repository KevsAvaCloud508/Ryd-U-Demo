import { Outlet } from 'react-router-dom';

import { DriverSidebar } from '../components/DriverSidebar';
import { VerificationProvider } from '../context/VerificationContext';

export function DriverLayout() {
  return (
    <VerificationProvider>
      {/*
        Columna en móvil (la barra superior del sidebar ocupa arriba y el
        contenido queda debajo a ancho completo) y fila en escritorio (el
        sidebar de 260px a la izquierda + contenido flexible).
        En fila, un ítem con w-full habría empujado a <main> a 0 de ancho.
      */}
      <div className="flex min-h-screen flex-col bg-black lg:flex-row">
        <DriverSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </VerificationProvider>
  );
}
