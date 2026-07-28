import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Button, FieldLabel, Pill, Segmented } from '../../../shared/components';
import { roleVerificationPath } from '../../../shared/routes/role-paths';
import type { Role } from '../../../shared/types/auth';
import { useAuth } from '../hooks/useAuth';
import { signupSchema, type SignupFormValues } from '../schemas/auth.schemas';

const roleOptions: { label: string; value: Role; icon: ReactNode }[] = [
  { label: 'Pasajero', value: 'STUDENT', icon: <i className="bi bi-person-walking" /> },
  { label: 'Conductor', value: 'DRIVER', icon: <i className="bi bi-car-front" /> },
];

// Vista C · Registro: creación de cuenta con correo universitario
export function SignupPage() {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = (searchParams.get('role') as Role | null) ?? 'STUDENT';
  const validRole = roleParam === 'DRIVER' ? 'DRIVER' : 'STUDENT';
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: '', lastNamePaternal: '', lastNameMaternal: '', email: '', password: '', confirmPassword: '', role: validRole, acceptsTerms: false },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setFormError(null);
    try {
      const { user } = await registerUser({
        firstName: values.firstName,
        lastNamePaternal: values.lastNamePaternal,
        lastNameMaternal: values.lastNameMaternal || undefined,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      navigate(roleVerificationPath[user.role], { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo completar el registro.');
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
            Únete a la comunidad
            <br />
            que comparte camino.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Regístrate con tu correo <b className="text-white">.edu</b>. Verificaremos que seas estudiante antes de
            activar tu cuenta.
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-[13px] text-muted">
          <i className="bi bi-patch-check" /> 100% verificados &nbsp; <i className="bi bi-people" /> +2,400
          estudiantes
        </div>
      </div>
      <div className="flex flex-col justify-center px-[52px] py-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Crear cuenta</h2>
        <p className="mt-1 text-sm text-muted">Paso 1 de 2 · Tus datos</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex gap-3">
            <div className="flex-1">
              <FieldLabel>Nombre(s)</FieldLabel>
              <input
                type="text"
                placeholder="Nombre"
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
                {...register('firstName')}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>}
            </div>
            <div className="flex-1">
              <FieldLabel>Apellido paterno</FieldLabel>
              <input
                type="text"
                placeholder="Paterno"
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
                {...register('lastNamePaternal')}
              />
              {errors.lastNamePaternal && <p className="mt-1 text-xs text-red-400">{errors.lastNamePaternal.message}</p>}
            </div>
          </div>
          <FieldLabel>Apellido materno (opcional)</FieldLabel>
          <input
            type="text"
            placeholder="Materno"
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
            {...register('lastNameMaternal')}
          />
          {errors.lastNameMaternal && <p className="mt-1 text-xs text-red-400">{errors.lastNameMaternal.message}</p>}

          <FieldLabel>Correo universitario (.edu)</FieldLabel>
          <input
            type="email"
            placeholder="tucorreo@alumnos.upa.edu.mx"
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}

          <div className="flex gap-3">
            <div className="flex-1">
              <FieldLabel>Contraseña</FieldLabel>
              <input
                type="password"
                placeholder="••••••••••"
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
                {...register('password')}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <div className="flex-1">
              <FieldLabel>Confirmar</FieldLabel>
              <input
                type="password"
                placeholder="••••••••••"
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <FieldLabel>Registrarme como</FieldLabel>
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

          <Controller
            control={control}
            name="acceptsTerms"
            render={({ field }) => (
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Pill
                  variant="dark"
                  role="checkbox"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className="cursor-pointer"
                >
                  {field.value && <i className="bi bi-check2" />}
                </Pill>
                <span className="text-muted">Acepto los Términos y el Aviso de privacidad</span>
              </div>
            )}
          />
          {errors.acceptsTerms && <p className="mt-1 text-xs text-red-400">{errors.acceptsTerms.message}</p>}

          {formError && <p className="mt-3 text-center text-xs text-red-400">{formError}</p>}

          <Button type="submit" variant="dark" fullWidth className="mt-[18px]" disabled={isLoading}>
            {isLoading ? 'Creando cuenta…' : 'Continuar'} <i className="bi bi-arrow-right" />
          </Button>
        </form>
        <p className="mt-3.5 text-center text-[13px] text-muted">
          ¿Ya tienes cuenta? <Link to="/acceso" className="font-bold text-white">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
