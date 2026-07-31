import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Card, FieldLabel, SubPageLayout } from '../../../shared/components';
import { useToast } from '../../../shared/toast/ToastProvider';
import { inputClass } from '../../../shared/utils/input-class';
import { readStoredJSON, writeStoredJSON } from '../../../shared/utils/local-storage';

const accountSchema = z.object({
  accountHolder: z.string().trim().min(3, 'El nombre del titular es obligatorio.'),
  bank: z.string().trim().min(2, 'El banco es obligatorio.'),
  clabe: z.string().trim().regex(/^\d{18}$/, 'La CLABE debe tener exactamente 18 dígitos.'),
});

type AccountFormValues = z.infer<typeof accountSchema>;

// Persistencia local: no existe endpoint de cuentas de cobro en la API, así que se
// conserva la cuenta en localStorage siguiendo el patrón de token-storage.
const ACCOUNT_STORAGE_KEY = 'rydu_payout_account';

function readSavedAccount(): AccountFormValues | null {
  const parsed = accountSchema.safeParse(readStoredJSON(ACCOUNT_STORAGE_KEY));
  return parsed.success ? parsed.data : null;
}

function writeSavedAccount(account: AccountFormValues): void {
  writeStoredJSON(ACCOUNT_STORAGE_KEY, account);
}

// Vista de la opción "Cuenta para cobros" del perfil del conductor.
export function DProfileAccountPage() {
  const { showToast } = useToast();
  const [savedAccount, setSavedAccount] = useState<AccountFormValues | null>(readSavedAccount);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: readSavedAccount() ?? { accountHolder: '', bank: '', clabe: '' },
  });

  const onSubmit = (values: AccountFormValues) => {
    setSavedAccount(values);
    setIsEditing(false);
    writeSavedAccount(values);
    showToast('Cuenta de cobro guardada correctamente.', 'success');
  };

  const handleEdit = () => {
    if (savedAccount) {
      reset(savedAccount);
    }
    setIsEditing(true);
  };

  return (
    <SubPageLayout
      title="Cuenta para cobros"
      subtitle="Datos de la cuenta donde recibirás el pago de tus viajes"
    >
      <div className="mt-8 flex max-w-[640px] flex-col gap-4">
        {savedAccount && !isEditing && (
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black">
                <i className="bi bi-check-lg" />
              </span>
              <b className="text-lg text-white">Cuenta configurada</b>
              <button
                type="button"
                onClick={handleEdit}
                className="ml-auto text-sm font-bold text-white underline-offset-4 transition-colors hover:underline"
              >
                Editar
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl bg-surface2 px-4 py-3 text-sm">
                <span className="text-muted">Titular</span>
                <b className="text-white">{savedAccount.accountHolder}</b>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface2 px-4 py-3 text-sm">
                <span className="text-muted">Banco</span>
                <b className="text-white">{savedAccount.bank}</b>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface2 px-4 py-3 text-sm">
                <span className="text-muted">CLABE</span>
                <b className="font-mono tracking-wider text-white">{savedAccount.clabe}</b>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <b className="text-lg text-white">{savedAccount ? 'Actualizar cuenta' : 'Registra tu cuenta'}</b>
          {isEditing && savedAccount && (
            <p className="mt-1 text-sm text-muted">Modifica los datos y guarda los cambios.</p>
          )}
          <p className="mt-1 text-sm text-muted">
            Los cobros se realizan por transferencia a la CLABE que registres.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 flex flex-col gap-4">
            <div>
              <FieldLabel>Nombre del titular</FieldLabel>
              <input
                type="text"
                placeholder="Nombre completo"
                className={inputClass}
                {...register('accountHolder')}
              />
              {errors.accountHolder && (
                <p className="mt-1 text-xs text-red-400">{errors.accountHolder.message}</p>
              )}
            </div>
            <div>
              <FieldLabel>Banco</FieldLabel>
              <input type="text" placeholder="Ej. BBVA, Santander…" className={inputClass} {...register('bank')} />
              {errors.bank && <p className="mt-1 text-xs text-red-400">{errors.bank.message}</p>}
            </div>
            <div>
              <FieldLabel>CLABE interbancaria</FieldLabel>
              <input
                type="text"
                inputMode="numeric"
                maxLength={18}
                placeholder="18 dígitos"
                className={inputClass}
                {...register('clabe')}
              />
              {errors.clabe && <p className="mt-1 text-xs text-red-400">{errors.clabe.message}</p>}
            </div>
            <Button type="submit" className="mt-2 w-fit">
              <i className="bi bi-save" /> Guardar cuenta
            </Button>
          </form>
        </Card>
      </div>
    </SubPageLayout>
  );
}
