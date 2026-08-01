import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, FieldLabel } from '../../../shared/components';
import { forgotPasswordRequest } from '../services/auth.service';

// Vista B2 · Olvidar contraseña: solicita restablecer la contraseña por correo
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);
    try {
      const result = await forgotPasswordRequest({ email: email.trim().toLowerCase() });
      setMessage(result.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-2 bg-black text-[#e5e7eb]">
      <div className="flex flex-col border-r border-line bg-gradient-to-br from-surface to-black p-11">
        <Link to="/">
          <img className="h-6 w-auto" src="/logo.svg" alt="RydU" />
        </Link>
        <div className="my-auto">
          <h2 className="text-[30px] leading-tight text-white">
            ¿Olvidaste tu contraseña?
            <br />
            Te ayudamos a recuperarla.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Ingresa tu correo institucional y te enviaremos las instrucciones para restablecer tu acceso.
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-[13px] text-muted">
          <i className="bi bi-shield-lock" /> Datos protegidos &nbsp; <i className="bi bi-check2-circle" /> Solo
          estudiantes
        </div>
      </div>
      <div className="flex flex-col justify-center px-[52px] py-11">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Recuperar acceso</h2>
        <p className="mt-1 text-sm text-muted">Ingresa tu correo institucional</p>

        <form onSubmit={onSubmit} noValidate>
          <FieldLabel>Correo institucional</FieldLabel>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@alumnos.upa.edu.mx"
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
          />

          {error && <p className="mt-3 text-center text-xs text-red-400">{error}</p>}
          {message && (
            <div className="mt-3 rounded-xl border border-purple-500/25 bg-purple-500/10 p-3 text-xs leading-relaxed text-purple-200">
              <i className="bi bi-envelope-check mr-1"></i>
              {message}
            </div>
          )}

          <Button type="submit" fullWidth className="mt-[18px]" disabled={isLoading || email.trim() === ''}>
            {isLoading ? 'Enviando…' : 'Enviar instrucciones'}
          </Button>
        </form>
        <p className="mt-4 text-center text-[13px] text-muted">
          ¿Ya recordaste?{' '}
          <Link to="/acceso" className="font-bold text-white">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
