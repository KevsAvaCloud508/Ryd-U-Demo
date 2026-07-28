import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, Button, FieldLabel, Modal } from '../../../shared/components';
import { api } from '../../../shared/api/axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../../../shared/toast/ToastProvider';

const profileSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  lastNamePaternal: z.string().trim().min(2, 'El apellido paterno debe tener al menos 2 caracteres.'),
  lastNameMaternal: z.string().trim().optional(),
  phone: z.string().trim().refine(
    (v) => !v || v.length >= 10,
    'El telefono debe tener al menos 10 caracteres.'
  ).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
}

async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('photo', file);
  const { data } = await api.post<{ photoUrl: string }>('/auth/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.photoUrl;
}

/**
 * Modal de edicion de perfil.
 * Permite al usuario actualizar su nombre, apellidos y telefono.
 * Se usa tanto en la vista de pasajero como de conductor.
 */
export function ProfileEditModal({ open, onClose }: ProfileEditModalProps) {
  const { user, editProfile, isLoading } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastNamePaternal: user?.lastNamePaternal ?? '',
      lastNameMaternal: user?.lastNameMaternal ?? '',
      phone: user?.phone ?? '',
    },
  });

  // Sincronizar el formulario con los datos del usuario cuando se abre el modal
  useEffect(() => {
    if (open && user) {
      reset({
        firstName: user.firstName,
        lastNamePaternal: user.lastNamePaternal,
        lastNameMaternal: user.lastNameMaternal ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [open, user, reset]);

  // Limpiar preview cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
    }
  }, [open]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamano (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no puede superar 5MB.', 'error');
      return;
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Solo se permiten imagenes JPG, PNG o WebP.', 'error');
      return;
    }

    // Mostrar preview local
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Subir foto y actualizar el estado de Redux para que todos los Avatares se actualicen
    setUploadingPhoto(true);
    try {
      const photoUrl = await uploadPhoto(file);
      // Actualizar el usuario en Redux con la nueva foto
      await editProfile({ photoUrl });
      setPreviewUrl(null); // Limpiar preview porque ahora user.photoUrl tiene la foto real
      showToast('Foto de perfil actualizada.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo subir la foto.', 'error');
      setPreviewUrl(null);
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await editProfile({
        firstName: values.firstName,
        lastNamePaternal: values.lastNamePaternal,
        lastNameMaternal: values.lastNameMaternal || null,
        phone: values.phone || undefined,
      });
      onClose();
      showToast('Perfil actualizado correctamente.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo actualizar el perfil.', 'error');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-extrabold tracking-tight text-white">Editar perfil</h2>
        <p className="mt-1 text-sm text-muted">Actualiza tu informacion personal</p>

        {/* Foto de perfil */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div className="relative">
            <Avatar
              initial={user?.firstName?.[0] ?? 'U'}
              size={80}
              photoUrl={previewUrl ?? user?.photoUrl}
              onClick={() => fileInputRef.current?.click()}
              className="text-2xl"
            />
            {uploadingPhoto && (
              <div className="absolute inset-0 grid place-items-center rounded-full bg-black/60">
                <i className="bi bi-arrow-repeat animate-spin text-white text-lg" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-white font-bold hover:underline"
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? 'Subiendo...' : 'Cambiar foto'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <FieldLabel>Nombre</FieldLabel>
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <FieldLabel>Apellido paterno</FieldLabel>
            <input
              type="text"
              placeholder="Apellido paterno"
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
              {...register('lastNamePaternal')}
            />
            {errors.lastNamePaternal && (
              <p className="mt-1 text-xs text-red-400">{errors.lastNamePaternal.message}</p>
            )}
          </div>

          <div>
            <FieldLabel>Apellido materno (opcional)</FieldLabel>
            <input
              type="text"
              placeholder="Apellido materno"
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
              {...register('lastNameMaternal')}
            />
          </div>

          <div>
            <FieldLabel>Telefono</FieldLabel>
            <input
              type="tel"
              placeholder="10 digitos"
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-[#e5e5ea] placeholder:text-muted focus:border-white/40 focus:bg-surface2 focus:outline-none"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="dark" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
