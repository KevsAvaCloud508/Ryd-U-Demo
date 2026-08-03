const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/**
 * Formatea una fecha ISO ("2026-07-11T00:00:00.000Z" o "2026-07-11") a texto
 * corto en español ("11 jul") sin depender de la zona horaria del navegador.
 */
export function formatDate(value: string | null | undefined, withYear = false): string {
  if (!value) return '—';
  const [year, month, day] = value.slice(0, 10).split('-');
  if (!year || !month || !day) return value.slice(0, 10);
  const monthLabel = MONTHS[Number(month) - 1] ?? month;
  return withYear ? `${Number(day)} ${monthLabel} ${year}` : `${Number(day)} ${monthLabel}`;
}
