import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, FieldLabel, Modal } from '../../../shared/components';
import { inputClass } from '../../../shared/utils/input-class';
import { emptyVehicleFormValues, vehicleSchema, type VehicleFormValues } from '../schemas/vehicle.schemas';
import { VehicleFields } from './VehicleFields';

interface VehicleChangeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues, documentName: string) => Promise<void>;
  isSubmitting: boolean;
}

// Modal para solicitar el cambio del vehículo registrado: requiere llenar el
// formulario con los datos del nuevo vehículo y adjuntar un comprobante de
// propiedad (factura o tarjeta de circulación) para que la solicitud sea válida.
export function VehicleChangeModal({ open, onClose, onSubmit, isSubmitting }: VehicleChangeModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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
      reset(emptyVehicleFormValues);
      setDocumentName(null);
      setFileError(null);
    }
  }, [open, reset]);

  const handleFileChange = (file?: File) => {
    if (!file) {
      setDocumentName(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('El documento no puede superar 5MB.');
      setDocumentName(null);
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Solo se permiten imágenes o PDF.');
      setDocumentName(null);
      return;
    }
    setFileError(null);
    setDocumentName(file.name);
  };

  const onSubmitForm = (values: VehicleFormValues) => {
    if (!documentName) {
      setFileError('Adjunta un comprobante de propiedad para solicitar el cambio.');
      return;
    }
    onSubmit(values, documentName);
  };

  return (
    <Modal open={open} onClose={onClose} title="Solicitar cambio de vehículo">
      <form onSubmit={handleSubmit(onSubmitForm)} noValidate className="flex flex-col gap-3">
        <p className="text-xs text-muted">
          Completa los datos del vehículo nuevo y adjunta un comprobante de propiedad (factura o
          tarjeta de circulación). La solicitud quedará en revisión.
        </p>

        <VehicleFields register={register} errors={errors} />

        {/* Comprobante de propiedad */}
        <div>
          <FieldLabel>Comprobante de propiedad</FieldLabel>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`${inputClass} flex items-center justify-between gap-2 text-left`}
          >
            {documentName ? (
              <>
                <span className="truncate text-[#e5e5ea]">{documentName}</span>
                <i className="bi bi-file-earmark-check text-lg text-white" />
              </>
            ) : (
              <>
                <span className="text-muted">Subir factura o tarjeta de circulación</span>
                <i className="bi bi-cloud-arrow-up text-lg text-muted" />
              </>
            )}
          </button>
          {fileError && <p className="mt-1 text-xs text-red-400">{fileError}</p>}
        </div>

        <Button type="submit" fullWidth className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Solicitar cambio'}
        </Button>
      </form>
    </Modal>
  );
}
