import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { FieldLabel } from '../../../shared/components';
import { inputClass } from '../../../shared/utils/input-class';
import type { VehicleFormValues } from '../schemas/vehicle.schemas';

interface VehicleFieldsProps {
  register: UseFormRegister<VehicleFormValues>;
  errors: FieldErrors<VehicleFormValues>;
}

// Campos compartidos del formulario de vehículo, usados tanto en el modal de
// registro/edición (VehicleFormModal) como en el de solicitud de cambio (VehicleChangeModal).
export function VehicleFields({ register, errors }: VehicleFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Marca</FieldLabel>
          <input className={inputClass} {...register('brand')} />
          {errors.brand && <p className="mt-1 text-xs text-red-400">{errors.brand.message}</p>}
        </div>
        <div>
          <FieldLabel>Modelo</FieldLabel>
          <input className={inputClass} {...register('model')} />
          {errors.model && <p className="mt-1 text-xs text-red-400">{errors.model.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Color</FieldLabel>
          <input className={inputClass} {...register('color')} />
          {errors.color && <p className="mt-1 text-xs text-red-400">{errors.color.message}</p>}
        </div>
        <div>
          <FieldLabel>Placas</FieldLabel>
          <input className={inputClass} {...register('plates')} />
          {errors.plates && <p className="mt-1 text-xs text-red-400">{errors.plates.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Capacidad (asientos)</FieldLabel>
          <input type="number" className={inputClass} {...register('capacity')} />
          {errors.capacity && <p className="mt-1 text-xs text-red-400">{errors.capacity.message}</p>}
        </div>
        <div>
          <FieldLabel>Año</FieldLabel>
          <input type="number" className={inputClass} {...register('year')} />
          {errors.year && <p className="mt-1 text-xs text-red-400">{errors.year.message}</p>}
        </div>
      </div>
    </>
  );
}
