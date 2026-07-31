import { useState } from 'react';
import { z } from 'zod';

import { Card, SubPageLayout, ToggleRow } from '../../../shared/components';
import { readStoredJSON, writeStoredJSON } from '../../../shared/utils/local-storage';

const notificationPrefsSchema = z.object({
  tripRequests: z.boolean(),
  tripChanges: z.boolean(),
  messages: z.boolean(),
  ratings: z.boolean(),
  promotions: z.boolean(),
  weeklyDigest: z.boolean(),
});

type NotificationPrefs = z.infer<typeof notificationPrefsSchema>;

// Persistencia local de las preferencias de notificación (no existe endpoint en la API).
const NOTIFICATION_PREFS_KEY = 'rydu_notification_prefs';
const DEFAULT_PREFS: NotificationPrefs = {
  tripRequests: true,
  tripChanges: true,
  messages: true,
  ratings: true,
  promotions: false,
  weeklyDigest: false,
};

function readPrefs(): NotificationPrefs {
  const parsed = notificationPrefsSchema.safeParse(readStoredJSON(NOTIFICATION_PREFS_KEY));
  return parsed.success ? parsed.data : DEFAULT_PREFS;
}

function writePrefs(prefs: NotificationPrefs): void {
  writeStoredJSON(NOTIFICATION_PREFS_KEY, prefs);
}

const PREFS_ROWS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: 'tripRequests', label: 'Solicitudes de viaje', description: 'Cuando un pasajero solicite unirse a tu viaje.' },
  { key: 'tripChanges', label: 'Cambios en mis viajes', description: 'Cancelaciones, modificaciones y recordatorios.' },
  { key: 'messages', label: 'Mensajes de pasajeros', description: 'Cuando recibas un mensaje sobre un viaje.' },
  { key: 'ratings', label: 'Calificaciones recibidas', description: 'Cuando un pasajero califique tu viaje.' },
  { key: 'promotions', label: 'Promociones y novedades', description: 'Ofertas y noticias de RydU.' },
  { key: 'weeklyDigest', label: 'Resumen semanal por correo', description: 'Un resumen de tu actividad cada semana.' },
];

// Vista de la opción "Notificaciones" del perfil del conductor.
// Página de preferencias: qué notificaciones quiere recibir el usuario.
// Las opciones se muestran en una rejilla de doble columna para aprovechar el espacio.
export function DProfileNotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(readPrefs);

  const toggle = (key: keyof NotificationPrefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    writePrefs(next);
    setPrefs(next);
  };

  return (
    <SubPageLayout title="Notificaciones" subtitle="Elige qué notificaciones quieres recibir">
      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        {PREFS_ROWS.map((row) => (
          <Card key={row.key}>
            <ToggleRow
              label={row.label}
              description={row.description}
              checked={prefs[row.key]}
              onChange={() => toggle(row.key)}
            />
          </Card>
        ))}
      </div>
    </SubPageLayout>
  );
}
