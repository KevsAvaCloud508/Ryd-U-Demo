import { Link } from 'react-router-dom';

import { Button, Card, Pill } from '../../../shared/components';

// Vista P0 · Inicio del pasajero — panel principal
export function PassengerHomePage() {
  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      {/* Barra superior */}
      <div className="flex h-16 items-center gap-6 border-b border-line px-7">
        <Link to="/">
          <img className="h-6 w-auto" src="/logo.svg" alt="RydU" />
        </Link>
        <div className="flex gap-[22px] text-sm font-semibold text-muted">
          <span className="text-white">Inicio</span>
          <span>Buscar viaje</span>
          <span>Mis viajes</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Pill variant="dark">
            <i className="bi bi-person-walking" /> Pasajero
          </Pill>
        </div>
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-[1100px] px-8 py-10">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold tracking-tight text-white">
            ¡Bienvenido a RydU!
          </h1>
          <p className="mt-1 text-sm text-muted">
            Encuentra viajes hacia tu universidad y ahorra compartiendo el camino.
          </p>
        </div>

        {/* Acciones rápidas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-xl text-white">
              <i className="bi bi-search" />
            </div>
            <h3 className="mb-1 text-[15px] font-semibold text-white">Buscar viaje</h3>
            <p className="text-[13px] text-muted">
              Encuentra rutas disponibles hacia tu universidad.
            </p>
            <Button fullWidth className="mt-4" size="sm">
              Explorar rutas
            </Button>
          </Card>

          <Card className="p-6">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-xl text-white">
              <i className="bi bi-clock-history" />
            </div>
            <h3 className="mb-1 text-[15px] font-semibold text-white">Mis viajes</h3>
            <p className="text-[13px] text-muted">
              Revisa el historial y estado de tus viajes.
            </p>
            <Button fullWidth className="mt-4" size="sm" variant="dark">
              Ver historial
            </Button>
          </Card>

          <Card className="p-6">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-xl text-white">
              <i className="bi bi-person-badge" />
            </div>
            <h3 className="mb-1 text-[15px] font-semibold text-white">Verificación</h3>
            <p className="text-[13px] text-muted">
              Completa la verificación de tu identidad.
            </p>
            <Link to="/pasajero/validacion">
              <Button fullWidth className="mt-4" size="sm" variant="dark">
                Verificar cuenta
              </Button>
            </Link>
          </Card>
        </div>

        {/* Viajes recientes (placeholder) */}
        <h2 className="mb-4 mt-10 text-lg font-bold text-white">Viajes disponibles cerca de ti</h2>
        <Card className="p-8 text-center">
          <div className="text-3xl text-muted/50">
            <i className="bi bi-car-front" />
          </div>
          <p className="mt-2 text-sm text-muted">
            No hay viajes disponibles en este momento. Vuelve más tarde.
          </p>
        </Card>
      </div>
    </div>
  );
}
