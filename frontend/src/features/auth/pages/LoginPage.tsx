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
export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    // Restaurar valor de "Recordarme" desde localStorage
    return localStorage.getItem('rydu_rememberMe') === 'true';
  });
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: 'STUDENT' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    // Guardar preferencia de "Recordarme"
    localStorage.setItem('rydu_rememberMe', String(rememberMe));
    try {
      const { user } = await login(values);
      // Siempre ir a la pagina de inicio despues del login
      navigate(roleHomePath[user.role], { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
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
            Tu universidad,
            <br />a un viaje de distancia.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Inicia sesión con tu correo institucional para acceder a viajes verificados.
          </p>
        </div>
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

          <div className="flex items-center justify-between">
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
