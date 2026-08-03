import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Modal } from '../../../shared/components';
import { emptyVehicleFormValues, vehicleSchema, type VehicleFormValues } from '../schemas/vehicle.schemas';
import type { Vehicle } from '../types/vehicle.types';
import { VehicleFields } from './VehicleFields';

interface VehicleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  vehicle?: Vehicle | null;
  isSubmitting: boolean;
}

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
    defaultValues: emptyVehicleFormValues,
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
          : emptyVehicleFormValues,
      );
    }
  }, [open, vehicle, reset]);

  return (
    <Modal open={open} onClose={onClose} title={vehicle ? 'Editar vehículo' : 'Registrar vehículo'}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        <VehicleFields register={register} errors={errors} />

        <Button type="submit" fullWidth className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : vehicle ? 'Guardar cambios' : 'Registrar vehículo'}
        </Button>
      </form>
    </Modal>
  );
}
