import { useCallback, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Claves de localStorage
// ---------------------------------------------------------------------------
const TOTAL_KEY = 'rydu_total_earnings';
const MO_KEY = 'rydu_monthly_earnings';
const MK_KEY = 'rydu_month_key';

function getMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function loadNum(key: string, fallback: number): number {
  const v = localStorage.getItem(key);
  return v !== null ? Number(v) : fallback;
}

function saveNum(key: string, val: number) {
  localStorage.setItem(key, String(val));
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useEarnings() {
  const [totalEarnings, setTotalEarnings] = useState<number>(() => loadNum(TOTAL_KEY, 1240));
  const [monthlyEarnings, setMonthlyEarnings] = useState<number>(() => loadNum(MO_KEY, 4860));

  // Al montar, detectar si cambió el mes para reiniciar el acumulado mensual
  useEffect(() => {
    const currentMonth = getMonthKey();
    const storedMonth = localStorage.getItem(MK_KEY);

    if (storedMonth !== currentMonth) {
      setMonthlyEarnings(0);
      saveNum(MO_KEY, 0);
      localStorage.setItem(MK_KEY, currentMonth);
    }
  }, []);

  const withdraw = useCallback(() => {
    setTotalEarnings(0);
    saveNum(TOTAL_KEY, 0);
  }, []);

  return { totalEarnings, monthlyEarnings, withdraw };
}
