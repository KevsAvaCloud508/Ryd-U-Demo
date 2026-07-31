import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Card,
  Divider,
  FieldLabel,
  ListRow,
  Pill,
  SubPageLayout,
  ToggleRow,
} from '../../../shared/components';
import { useToast } from '../../../shared/toast/ToastProvider';
import { inputClass } from '../../../shared/utils/input-class';
import { readStoredJSON, writeStoredJSON } from '../../../shared/utils/local-storage';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa tu contraseña actual.'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const securitySettingsSchema = z.object({
  twoFactor: z.boolean(),
  loginAlerts: z.boolean(),
  appLock: z.boolean(),
  autoLogout: z.boolean(),
});

type SecuritySettings = z.infer<typeof securitySettingsSchema>;

// Persistencia local de los ajustes de seguridad (no existe endpoint en la API).
const SECURITY_STORAGE_KEY = 'rydu_security_settings';
const DEFAULT_SECURITY: SecuritySettings = {
  twoFactor: false,
  loginAlerts: true,
  appLock: false,
  autoLogout: true,
};

function readSecuritySettings(): SecuritySettings {
  const parsed = securitySettingsSchema.safeParse(readStoredJSON(SECURITY_STORAGE_KEY));
  return parsed.success ? parsed.data : DEFAULT_SECURITY;
}

function writeSecuritySettings(settings: SecuritySettings): void {
  writeStoredJSON(SECURITY_STORAGE_KEY, settings);
}

const SECURITY_ROWS: { key: keyof SecuritySettings; label: string; description: string }[] = [
  {
    key: 'twoFactor',
    label: 'Autenticación en dos pasos',
    description: 'Recibe un código de seguridad al iniciar sesión.',
  },
  {
    key: 'loginAlerts',
    label: 'Alertas de inicio de sesión',
    description: 'Avisa cuando se acceda desde un dispositivo nuevo.',
  },
  {
    key: 'appLock',
    label: 'Bloqueo de la aplicación',
    description: 'Pide tu PIN para abrir RydU.',
  },
  {
    key: 'autoLogout',
    label: 'Cerrar sesión automática',
    description: 'Cierra tu sesión tras 30 minutos de inactividad.',
  },
];

// Vista de la opción "Seguridad" del perfil del conductor.
// Las opciones de seguridad se muestran en rejilla de doble columna para llenar el espacio.
export function DProfileSecurityPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SecuritySettings>(readSecuritySettings);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = () => {
    // Simula el cambio de contraseña (el endpoint de cambio aún no está en la API).
    reset();
    showToast('Contraseña actualizada correctamente.', 'success');
  };

  const toggle = (key: keyof SecuritySettings) => {
    const next = { ...settings, [key]: !settings[key] };
    writeSecuritySettings(next);
    setSettings(next);
  };

  return (
    <SubPageLayout title="Seguridad" subtitle="Administra el acceso y protege tu cuenta">
      <div className="mt-8 flex flex-col gap-4">
        <Card className="max-w-[640px] p-6">
          <b className="text-lg text-white">Cambiar contraseña</b>
          <p className="mt-1 text-sm text-muted">
            La nueva contraseña debe tener al menos 8 caracteres.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 flex flex-col gap-4">
            <div>
              <FieldLabel>Contraseña actual</FieldLabel>
              <input
                type="password"
                placeholder="••••••••"
                className={inputClass}
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <FieldLabel>Nueva contraseña</FieldLabel>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                className={inputClass}
                {...register('newPassword')}
              />
              {errors.newPassword && <p className="mt-1 text-xs text-red-400">{errors.newPassword.message}</p>}
            </div>
            <div>
              <FieldLabel>Confirmar nueva contraseña</FieldLabel>
              <input
                type="password"
                placeholder="Repite la contraseña"
                className={inputClass}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="mt-2 w-fit">
              <i className="bi bi-shield-lock" /> Actualizar contraseña
            </Button>
          </form>
        </Card>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {SECURITY_ROWS.map((row) => (
            <Card key={row.key}>
              <ToggleRow
                label={row.label}
                description={row.description}
                checked={settings[row.key]}
                onChange={() => toggle(row.key)}
              />
            </Card>
          ))}
        </div>

        <Card className="py-2">
          <div className="px-6 pt-4 pb-1">
            <b className="text-lg text-white">Sesiones activas</b>
          </div>
          <ListRow
            icon={<i className="bi bi-laptop text-lg text-muted" />}
            label={
              <span>
                <b className="text-[15px] text-white">Este dispositivo</b>
                <div className="text-xs text-muted">México · Ahora</div>
              </span>
            }
            trailing={<Pill variant="dark">Activa</Pill>}
          />
          <Divider />
          <ListRow
            icon={<i className="bi bi-phone text-lg text-muted" />}
            label={
              <span>
                <b className="text-[15px] text-white">iPhone de Juan</b>
                <div className="text-xs text-muted">CDMX · Hace 2 días</div>
              </span>
            }
            trailing={<Pill variant="dark">Activa</Pill>}
          />
        </Card>

        <div>
          <Button variant="dark" onClick={() => showToast('Sesión cerrada en todos los dispositivos.', 'success')}>
            <i className="bi bi-shield-exclamation" /> Cerrar sesión en todos los dispositivos
          </Button>
        </div>
      </div>
    </SubPageLayout>
  );
}
