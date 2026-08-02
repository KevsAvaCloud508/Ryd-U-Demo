import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button, FieldLabel, Pill, Segmented } from '../../../shared/components';
import { roleHomePath } from '../../../shared/routes/role-paths';
import type { Role } from '../../../shared/types/auth';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas';

const roleOptions: { label: string; value: Role; icon: ReactNode }[] = [
  { label: 'Pasajero', value: 'STUDENT', icon: <i className="bi bi-person-walking" /> },
  { label: 'Conductor', value: 'DRIVER', icon: <i className="bi bi-car-front" /> },
];

// Vista B · Acceso: inicio de sesión con selección de rol (pasajero/conductor)
interface Credential {
  label: string;
  email: string;
  password: string;
  role: Role;
  icon: string;
}

const CREDENTIALS: Credential[] = [
  { label: 'Conductor', email: 'conductor@alumnos.upa.edu.mx', password: 'Conductor123', role: 'DRIVER', icon: 'bi-car-front' },
  { label: 'Pasajero', email: 'pasajero@alumnos.upa.edu.mx', password: 'Pasajero123', role: 'STUDENT', icon: 'bi-person-walking' },
];

const DEMO_EMAILS = ['conductor@alumnos.upa.edu.mx', 'pasajero@alumnos.upa.edu.mx', 'admin@alumnos.upa.edu.mx'];

export function LoginPage() {
  const { login, demoLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('rydu_rememberMe') === 'true';
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [loginCreds, setLoginCreds] = useState<{
    email: string;
    password: string;
    role: Role;
  }>({ email: '', password: '', role: 'STUDENT' });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: 'STUDENT' },
  });

  const redirectAfterLogin = (role: Role) => {
    navigate(roleHomePath[role], { replace: true });
  };

  const doLogin = async (values: LoginFormValues) => {
    setFormError(null);
    localStorage.setItem('rydu_rememberMe', String(rememberMe));

    const email = values.email.toLowerCase().trim();

    // ── Modo demo: si el email está en la lista de mock, login sin backend ──
    if (DEMO_EMAILS.includes(email)) {
      demoLogin({ email, role: values.role });
      redirectAfterLogin(values.role);
      return;
    }

    // ── Modo real: intentar contra la API ──
    try {
      const { user } = await login(values);
      redirectAfterLogin(user.role);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message :
        typeof error === 'string' ? error :
        'No se pudo iniciar sesión.';
      setFormError(msg);
    }
  };

  const onSubmit = (values: LoginFormValues) => doLogin(values);

  const loginWithCredential = async (cred: Credential) => {
    setLoginCreds({ email: cred.email, password: cred.password, role: cred.role });
    await doLogin({
      email: cred.email,
      password: cred.password,
      role: cred.role,
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-2 bg-black text-[#e5e7eb]">
      <div className="flex flex-col border-r border-line bg-gradient-to-br from-surface to-black p-11">
        <Link to="/">
          <img className="h-6 w-auto" src="/logo.svg" alt="RydU" />
        </Link>
        <div className="my-auto">
          <h2 className="text-[30px] leading-tight text-white">
            Tu universidad,
            <br />a un viaje de distancia.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Inicia sesión con tu correo institucional para acceder a viajes verificados.
          </p>
        </div>
        {/* Demo credentials box */}
        <div className="mb-6 rounded-xl border border-purple-500/25 bg-purple-500/10 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2 text-[13px] font-bold text-purple-300">
            <span></span> Credenciales de prueba
          </div>
          <div className="space-y-2 text-[13px]">
            {CREDENTIALS.map((cred) => (
              <div
                key={cred.role}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-white/10 ${
                  loginCreds.email === cred.email
                    ? 'border-purple-500/40 bg-purple-500/15'
                    : 'border-white/10 bg-white/5'
                }`}
                onClick={() => loginWithCredential(cred)}
              >
                <i className={`${cred.icon} text-purple-400`} />
                <span className="font-medium text-white">{cred.label}:</span>
                <span className="text-muted truncate">{cred.email}</span>
                <span className="ml-auto shrink-0 text-[11px] text-purple-400">{cred.password}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-white/10 pt-2 text-[12px] text-muted">
            <i className="bi bi-info-circle mr-1"></i>
            Haz clic en una credencial para iniciar sesión automáticamente.
          </div>
        </div>
        <a
          href="/dashboard.html"
          className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-500/30"
        >
          <i className="bi bi-bar-chart-fill text-base" />
          <span className="font-semibold">Panel de Incidencias</span>
          <i className="bi bi-arrow-right ml-auto text-[11px] text-amber-400/70" />
        </a>
        <div className="flex items-center gap-2.5 text-[13px] text-muted">
          <i className="bi bi-shield-lock" /> Datos protegidos &nbsp; <i className="bi bi-check2-circle" /> Solo
          estudiantes
        </div>
      </div>
      <div className="flex flex-col justify-center px-[52px] py-11">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-muted">Bienvenido de nuevo</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldLabel>Correo institucional</FieldLabel>
          <input
            type="email"
            placeholder="tucorreo@alumnos.upa.edu.mx"
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}

          <FieldLabel>Contraseña</FieldLabel>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-muted"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <i className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'} />
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}

          <FieldLabel>Ingresar como</FieldLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Segmented
                activeIndex={roleOptions.findIndex((option) => option.value === field.value)}
                options={roleOptions}
                onSelect={(index) => field.onChange(roleOptions[index].value)}
              />
            )}
          />

          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 text-xs text-muted hover:text-white transition-colors"
            >
              <Pill
                variant="dark"
                role="checkbox"
                aria-checked={rememberMe}
                className="cursor-pointer"
              >
                {rememberMe && <i className="bi bi-check2" />}
              </Pill>
              Recordarme
            </button>
            <Link to="/olvidar-contrasena" className="text-[13px] text-white font-bold hover:underline">
              Olvidé mi contraseña
            </Link>
          </div>

          {formError && <p className="mt-3 text-center text-xs text-red-400">{formError}</p>}

          <Button type="submit" fullWidth className="mt-[18px]" disabled={isLoading}>
            {isLoading ? 'Ingresando…' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-4 text-center text-[13px] text-muted">
          ¿No tienes cuenta? <Link to="/registro" className="font-bold text-white">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
