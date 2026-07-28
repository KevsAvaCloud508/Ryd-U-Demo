import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Modal } from '../../../shared/components';
import { vehicleSchema, type VehicleFormValues } from '../schemas/vehicle.schemas';
import type { Vehicle } from '../types/vehicle.types';

interface VehicleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  vehicle?: Vehicle | null;
  isSubmitting: boolean;
}

const emptyValues: VehicleFormValues = { brand: '', model: '', color: '', plates: '', capacity: 4, year: undefined };

// Modal reutilizado tanto para registrar un vehículo nuevo como para editar uno existente
// (si `vehicle` viene definido, el formulario se precarga con sus datos).
export function VehicleFormModal({ open, onClose, onSubmit, vehicle, isSubmitting }: VehicleFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        vehicle
          ? {
              brand: vehicle.brand,
              model: vehicle.model,
              color: vehicle.color,
              plates: vehicle.plates,
              capacity: vehicle.capacity,
              year: vehicle.year ?? undefined,
            }
          : emptyValues,
      );
    }
  }, [open, vehicle, reset]);

  const fieldClass =
    'w-full rounded-xl border border-line bg-surface2 px-3.5 py-2.5 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:outline-none';

  return (
    <Modal open={open} onClose={onClose} title={vehicle ? 'Editar vehículo' : 'Registrar vehículo'}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Marca</label>
            <input className={fieldClass} {...register('brand')} />
            {errors.brand && <p className="mt-1 text-xs text-red-400">{errors.brand.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Modelo</label>
            <input className={fieldClass} {...register('model')} />
            {errors.model && <p className="mt-1 text-xs text-red-400">{errors.model.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Color</label>
            <input className={fieldClass} {...register('color')} />
            {errors.color && <p className="mt-1 text-xs text-red-400">{errors.color.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Placas</label>
            <input className={fieldClass} {...register('plates')} />
            {errors.plates && <p className="mt-1 text-xs text-red-400">{errors.plates.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Capacidad (asientos)</label>
            <input type="number" className={fieldClass} {...register('capacity')} />
            {errors.capacity && <p className="mt-1 text-xs text-red-400">{errors.capacity.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Año</label>
            <input type="number" className={fieldClass} {...register('year')} />
            {errors.year && <p className="mt-1 text-xs text-red-400">{errors.year.message}</p>}
          </div>
        </div>

        <Button type="submit" fullWidth className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : vehicle ? 'Guardar cambios' : 'Registrar vehículo'}
        </Button>
      </form>
    </Modal>
  );
}
