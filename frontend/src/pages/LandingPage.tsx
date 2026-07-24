import { Link } from 'react-router-dom';
import { Avatar, Button, Card, MapPreview, Pill } from '../shared/components';

// Vista A · Landing publica: presentacion del servicio e ingreso
export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-[#e5e7eb]">
      {/* Barra superior */}
      <div className="flex h-16 items-center gap-6 border-b border-line px-7">
        <Link to="/">
          <img className="h-6 w-auto" src="/logo.svg" alt="RydU" />
        </Link>
        <div className="flex gap-[22px] text-sm font-semibold text-muted">
          <a href="#inicio" className="text-white">Inicio</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#seguridad">Seguridad</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/acceso">
            <Button variant="ghost" size="sm">
              Iniciar sesion
            </Button>
          </Link>
          <Link to="/registro">
            <Button size="sm">Crear cuenta</Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section id="inicio" className="grid items-center gap-[30px] px-12 py-14" style={{ gridTemplateColumns: '1.05fr .95fr' }}>
        <div>
          <Pill variant="dark">
            <i className="bi bi-mortarboard-fill" /> Exclusivo para universitarios verificados
          </Pill>
          <h1 className="my-4 text-[44px] leading-[1.1] tracking-tight text-white">
            Comparte el camino a la universidad, <span className="text-muted">seguro y economico</span>
          </h1>
          <p className="text-base leading-relaxed text-muted">
            Conecta con estudiantes de tu comunidad que hacen tu misma ruta. Elige tu rol: viaja como pasajero u
            ofrece asientos como conductor.
          </p>

            <Pill variant="dark" className="mt-4">
            <i className="bi bi-people mr-1"></i> ¿Cómo quieres usar Ryd-U?
            </Pill>

          <div className="mt-4 flex items-center gap-3">
            <Link to="/registro?role=STUDENT">
              <Button variant="ghost">
                <i className="bi bi-person-walking" /> Soy Pasajero
              </Button>
            </Link>
            <Link to="/registro?role=DRIVER">
              <Button variant="ghost">
                <i className="bi bi-car-front" /> Soy Conductor
              </Button>
            </Link>
          </div>
          <div className="mt-[26px] flex gap-[30px]">
            <div>
              <b className="text-[22px] text-white">-60%</b>
              <div className="text-xs text-muted">vs. taxi</div>
            </div>
            <div>
              <b className="text-[22px] text-white">100%</b>
              <div className="text-xs text-muted">verificados</div>
            </div>
            <div>
              <b className="text-[22px] text-white">
                4.8 <i className="bi bi-star-fill text-[15px]" />
              </b>
              <div className="text-xs text-muted">promedio</div>
            </div>
          </div>
        </div>
        <MapPreview className="h-80 rounded-[18px]">
          <Card className="absolute inset-x-4 bottom-4 p-3">
            <div className="flex items-center gap-3">
              <Avatar initial="J" />
              <div className="flex-1">
                <b className="text-sm text-white">Juan va a la UPA</b>
                <div className="text-xs text-white">
                  <i className="bi bi-star-fill" /> 4.8 · 3 asientos · $50
                </div>
              </div>
              <Link to="/registro?role=STUDENT">
                <Button size="sm">Unirme</Button>
              </Link>
            </div>
          </Card>
        </MapPreview>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="px-12 py-14 border-t border-line">
        <Pill variant="dark" className="mb-4">
          <i className="bi bi-gear" /> Pasos simples
        </Pill>
        <h2 className="text-[28px] font-extrabold tracking-tight text-white mb-8">
          Como funciona RydU
        </h2>
        <div className="grid grid-cols-4 gap-[18px]">
          <Card className="p-[22px] text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white">
              1
            </div>
            <i className="bi bi-person-plus text-[26px] text-white" />
            <h3 className="mb-1 mt-2 text-white font-semibold">Crea tu cuenta</h3>
            <p className="text-[13px] text-muted">Registrate con tu correo universitario y verifica tu identidad.</p>
          </Card>
          <Card className="p-[22px] text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white">
              2
            </div>
            <i className="bi bi-file-earmark-check text-[26px] text-white" />
            <h3 className="mb-1 mt-2 text-white font-semibold">Verificate</h3>
            <p className="text-[13px] text-muted">Sube tu INE, credencial universitaria y comprobante de inscripcion.</p>
          </Card>
          <Card className="p-[22px] text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white">
              3
            </div>
            <i className="bi bi-search text-[26px] text-white" />
            <h3 className="mb-1 mt-2 text-white font-semibold">Busca o ofrece viajes</h3>
            <p className="text-[13px] text-muted">Encuentra rutas hacia tu universidad o publica las tuyas.</p>
          </Card>
          <Card className="p-[22px] text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white">
              4
            </div>
            <i className="bi bi-car-front text-[26px] text-white" />
            <h3 className="mb-1 mt-2 text-white font-semibold">Viaja seguro</h3>
            <p className="text-[13px] text-muted">Comparte el camino con estudiantes verificados y ahorra.</p>
          </Card>
        </div>
      </section>

      {/* Beneficios */}
      <section id="seguridad" className="px-12 py-14 border-t border-line">
        <Pill variant="dark" className="mb-4">
          <i className="bi bi-shield-lock" /> Seguridad primero
        </Pill>
        <h2 className="text-[28px] font-extrabold tracking-tight text-white mb-8">
          Tu seguridad es nuestra prioridad
        </h2>
        <div className="grid grid-cols-3 gap-[18px]">
          <Card className="p-[22px]">
            <i className="bi bi-shield-check text-[26px]" />
            <h3 className="mb-1 mt-2 text-white">Comunidad verificada</h3>
            <p className="text-[13px] text-muted">Cada usuario pasa por un proceso de validacion con INE, credencial e inscripcion universitaria.</p>
          </Card>
          <Card className="p-[22px]">
            <i className="bi bi-star text-[26px]" />
            <h3 className="mb-1 mt-2 text-white">Sistema de calificaciones</h3>
            <p className="text-[13px] text-muted">Califica a tus companeros de viaje y revisa sus calificaciones antes de acceptar.</p>
          </Card>
          <Card className="p-[22px]">
            <i className="bi bi-chat-dots text-[26px]" />
            <h3 className="mb-1 mt-2 text-white">Reportes y soporte</h3>
            <p className="text-[13px] text-muted">Reporta cualquier problema y nuestro equipo lo revisara en menos de 24 horas.</p>
          </Card>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-[18px]">
          <Card className="p-[22px]">
            <i className="bi bi-piggy-bank text-[26px]" />
            <h3 className="mb-1 mt-2 text-white">Ahorra en cada viaje</h3>
            <p className="text-[13px] text-muted">Precios accesibles compartiendo gastos de gasolina y casetas.</p>
          </Card>
          <Card className="p-[22px]">
            <i className="bi bi-tree text-[26px]" />
            <h3 className="mb-1 mt-2 text-white">Menos trafico y CO2</h3>
            <p className="text-[13px] text-muted">Optimiza el uso de autos particulares y reduce tu huella de carbono.</p>
          </Card>
          <Card className="p-[22px]">
            <i className="bi bi-people text-[26px]" />
            <h3 className="mb-1 mt-2 text-white">Conoce gente nueva</h3>
            <p className="text-[13px] text-muted">Conecta con estudiantes de tu comunidad universitaria.</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-12 py-14 border-t border-line text-center">
        <h2 className="text-[28px] font-extrabold tracking-tight text-white">
          Listo para compartir el camino?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Unete a miles de universitarios que ya estan ahorrando y viajando seguro.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/registro?role=STUDENT">
            <Button>
              <i className="bi bi-person-walking" /> Soy Pasajero
            </Button>
          </Link>
          <Link to="/registro?role=DRIVER">
            <Button variant="ghost">
              <i className="bi bi-car-front" /> Soy Conductor
            </Button>
          </Link>
        </div>
      </section>

      {/* Contacto + Footer */}
      <footer id="contacto" className="border-t border-line px-12 py-10">
        <div className="grid grid-cols-3 gap-[18px]">
          <div>
            <Link to="/">
            <img className="h-6 w-auto mb-3" src="/logo.svg" alt="RydU" />
            </Link>
            <p className="text-[13px] text-muted leading-relaxed">
              Plataforma de ridesharing exclusiva para universitarios verificados. Ahorra, viaja seguro y conoce gente nueva.
            </p>
          </div>
          <div>
            <b className="text-sm text-white">Contacto</b>
            <div className="mt-2 space-y-1.5 text-[13px] text-muted">
              <div><i className="bi bi-envelope mr-2" /> soporte@rydu.mx</div>
              <div><i className="bi bi-instagram mr-2" /> @rydu_oficial</div>
              <div><i className="bi bi-phone mr-2" /> +52 (XXX) XXX-XXXX</div>
            </div>
          </div>
          <div>
            <b className="text-sm text-white">Links</b>
            <div className="mt-2 space-y-1.5 text-[13px] text-muted">
              <div><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></div>
              <div><a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a></div>
              <div><Link to="/acceso" className="hover:text-white transition-colors">Iniciar sesion</Link></div>
              <div><Link to="/registro" className="hover:text-white transition-colors">Crear cuenta</Link></div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-line flex items-center justify-between text-[12px] text-muted">
          <span>2026 RydU. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <span>Terminos de uso</span>
            <span>Aviso de privacidad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
