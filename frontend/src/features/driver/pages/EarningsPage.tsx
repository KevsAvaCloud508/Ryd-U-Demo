import { useEffect, useState } from 'react';

import { useToast } from '../../../shared/toast/ToastProvider';
import { useTrips } from '../../trips/hooks/useTrips';
import { PageHeader, Segmented } from '../../../shared/components';
import { AnnualMonthBlock, type AnnualMonthGroup } from '../components/AnnualMonthBlock';
import { EarningsTableRow, type EarningsRow } from '../components/EarningsTableRow';
import { useEarnings } from '../hooks/useEarnings';
import { isDemoSession } from '../../../shared/utils/session';

type Period = 'semana' | 'mes' | 'año';

// ---------------------------------------------------------------------------
// Mock data (modo demo)
// ---------------------------------------------------------------------------
const periodData: Record<Period, {
  trendLabel: string;
  chartLabels: string[];
  payments: EarningsRow[];
}> = {
  semana: {
    trendLabel: 'Tendencia semanal',
    chartLabels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    payments: [
      { date: '08 Jul', time: '9:50', passenger: 'María G.', route: 'Bosques del Prado → UPA', income: '+$150' },
      { date: '05 Jul', time: '7:00', passenger: 'Carlos R.', route: 'Villa de las Flores → UPA', income: '+$200' },
    ],
  },
  mes: {
    trendLabel: 'Tendencia mensual',
    chartLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    payments: [
      { date: '08 Jul', time: '9:50', passenger: 'María G.', route: 'Bosques del Prado → UPA', income: '+$150' },
      { date: '01 Jul', time: '7:00', passenger: 'Ana L.', route: 'San Miguel → UPA', income: '+$200' },
      { date: '15 Jul', time: '14:20', passenger: 'Laura V.', route: 'Villa de las Flores → UPA', income: '+$180' },
    ],
  },
  año: {
    trendLabel: 'Tendencia anual',
    chartLabels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    payments: [],
  },
};

const annualData: AnnualMonthGroup[] = [
  {
    month: 'Julio', total: '$10,680',
    routes: [
      { route: 'Bosques del Prado → UPA', count: 42, income: '$4,860' },
      { route: 'Villa de las Flores → UPA', count: 28, income: '$3,200' },
      { route: 'San Miguel → UPA', count: 18, income: '$2,620' },
    ],
  },
  {
    month: 'Junio', total: '$8,920',
    routes: [
      { route: 'Bosques del Prado → UPA', count: 35, income: '$4,120' },
      { route: 'San Miguel → UPA', count: 22, income: '$3,100' },
      { route: 'Villa de las Flores → UPA', count: 15, income: '$1,700' },
    ],
  },
  {
    month: 'Mayo', total: '$7,450',
    routes: [
      { route: 'Villa de las Flores → UPA', count: 30, income: '$3,500' },
      { route: 'Bosques del Prado → UPA', count: 25, income: '$2,950' },
      { route: 'San Miguel → UPA', count: 10, income: '$1,000' },
    ],
  },
];

function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString('es-MX');
}

const periodOptions: { key: Period; label: string }[] = [
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mes' },
  { key: 'año', label: 'Año' },
];

const periodDays: Record<Period, number> = {
  semana: 7,
  mes: 30,
  año: 365,
};

export function DriverEarningsPage() {
  const isDemo = isDemoSession();
  const [period, setPeriod] = useState<Period>('semana');
  const { totalEarnings: demoTotal, monthlyEarnings: demoMonthly, withdraw } = useEarnings();
  const { showToast } = useToast();
  const data = periodData[period];

  // ── Datos reales (sesión con API) ──
  const { trips, loadMine } = useTrips();

  useEffect(() => {
    if (isDemo) return;
    loadMine();
  }, [isDemo, loadMine]);

  const completedTrips = trips.filter((t) => t.status === 'Terminado');

  const toLocalDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);
  const inPeriod = (t: { date: string }, days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return toLocalDate(t.date) >= cutoff;
  };

  const realTotal = completedTrips.reduce((sum, t) => sum + Number(t.cost ?? 0), 0);
  const periodTrips = completedTrips.filter((t) => inPeriod(t, periodDays[period]));

  // Nombre del primer pasajero aceptado en el viaje (para el historial real).
  const passengerName = (t: (typeof completedTrips)[number]): string => {
    const accepted = t.requests?.find((r) => r.status === 'Aceptado');
    if (!accepted?.passenger) return '—';
    return `${accepted.passenger.firstName} ${accepted.passenger.lastNamePaternal}`.trim();
  };

  const realPayments: EarningsRow[] = periodTrips.map((t) => ({
    date: t.date ? toLocalDate(t.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—',
    time: t.departureTime?.slice(0, 5) ?? '',
    passenger: passengerName(t),
    route: `${t.route?.origin ?? '—'} → ${t.route?.destination ?? '—'}`,
    income: `+$${t.cost ?? 0}`,
  }));

  // Vista anual real: agrupa viajes terminados por mes y ruta (solo año actual).
  const currentYear = new Date().getFullYear();
  const realAnnual: AnnualMonthGroup[] = (() => {
    const byMonth = new Map<string, { total: number; routes: Map<string, { count: number; income: number }> }>();
    for (const t of completedTrips) {
      if (toLocalDate(t.date).getFullYear() !== currentYear) continue;
      const key = t.date ? toLocalDate(t.date).toLocaleDateString('es-MX', { month: 'long' }) : '—';
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const group = byMonth.get(label) ?? { total: 0, routes: new Map() };
      group.total += Number(t.cost ?? 0);
      const routeLabel = `${t.route?.origin ?? '—'} → ${t.route?.destination ?? '—'}`;
      const route = group.routes.get(routeLabel) ?? { count: 0, income: 0 };
      route.count += t.requests?.filter((r) => r.status === 'Aceptado').length ?? 0;
      route.income += Number(t.cost ?? 0);
      group.routes.set(routeLabel, route);
      byMonth.set(label, group);
    }
    return Array.from(byMonth.entries()).map(([month, g]) => ({
      month,
      total: formatCurrency(g.total),
      routes: Array.from(g.routes.entries()).map(([route, r]) => ({
        route,
        count: r.count,
        income: formatCurrency(r.income),
      })),
    }));
  })();

  // Tendencia real según el periodo seleccionado (semana / mes / año)
  const periodTripsForChart = completedTrips.filter((t) => inPeriod(t, periodDays[period]));
  const chartLabels = period === 'semana' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    : period === 'mes' ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
    : ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const realChartValues = chartLabels.map((_label, index) => {
    if (period === 'semana') {
      const dayName = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'][index];
      return periodTripsForChart
        .filter((t) => toLocalDate(t.date).toLocaleDateString('es-MX', { weekday: 'short' }).toLowerCase().startsWith(dayName.slice(0, 2)))
        .reduce((sum, t) => sum + Number(t.cost ?? 0), 0);
    }
    if (period === 'mes') {
      // Semanas del mes: el cutoff de la semana 1 = día 1 del mes
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const weekStart = new Date(startOfMonth);
      weekStart.setDate(1 + index * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      return periodTripsForChart
        .filter((t) => {
          const d = toLocalDate(t.date);
          return d >= weekStart && d < weekEnd;
        })
        .reduce((sum, t) => sum + Number(t.cost ?? 0), 0);
    }
    // Año: por mes
    return periodTripsForChart
      .filter((t) => toLocalDate(t.date).getMonth() === index)
      .reduce((sum, t) => sum + Number(t.cost ?? 0), 0);
  });

  const isReal = !isDemo;
  const totalDisplay = isReal ? realTotal : demoTotal;
  const monthlyDisplay = isReal
    ? completedTrips.filter((t) => inPeriod(t, 30)).reduce((s, t) => s + Number(t.cost ?? 0), 0)
    : demoMonthly;

  const handleWithdraw = () => {
    if (isReal) {
      showToast('El retiro se procesará próximamente.', 'info');
      return;
    }
    withdraw();
  };

  return (
    <div className="px-4 pb-10 sm:px-6 lg:px-10">
      <PageHeader
        title="Ganancias"
        subtitle="Tus ingresos por viajes compartidos"
        action={
          <Segmented
            size="lg"
            options={periodOptions}
            activeIndex={periodOptions.findIndex((o) => o.key === period)}
            onSelect={(i) => setPeriod(periodOptions[i].key)}
          />
        }
      />

      {/* Top panels */}
      <div className="mt-8 flex flex-col gap-5 lg:flex-row">
        {/* Income summary card */}
        <div className="flex w-full flex-col justify-between rounded-[24px] bg-[#F5F5F5] p-6 sm:p-7 lg:w-[42%]">
          <div>
            <p className="text-[16px] font-medium text-[#6B6B6B]">Ingresos totales</p>
            <p className="mt-1 text-5xl font-extrabold leading-none tracking-tight text-black sm:text-[64px]">
              {formatCurrency(totalDisplay)}
            </p>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={totalDisplay === 0}
            className="mt-6 w-full rounded-full bg-black py-4 text-[18px] font-bold text-white transition-all hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {totalDisplay === 0 ? 'Sin fondos para retirar' : 'Retirar a mi cuenta'}
          </button>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#353535] bg-white/10 px-5 py-4">
            <div>
              <p className="text-[13px] font-medium text-[#6B6B6B]">Ganancias totales del mes</p>
              <p className="mt-0.5 text-[22px] font-extrabold tracking-tight text-black">
                {formatCurrency(monthlyDisplay)}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-[13px] text-green-700">
                <i className="bi bi-graph-up-arrow text-sm text-green-600" />
                <span className="font-medium">
                  {isReal ? `${periodTrips.length} viajes en este periodo` : '+12% vs. mes anterior'}
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10">
              <i className="bi bi-calendar-month text-xl text-black" />
            </div>
          </div>
        </div>

        {/* Trend chart panel */}
        <div className="flex w-full flex-col rounded-[24px] border border-[#353535] bg-[#222222] p-5 sm:p-[26px] lg:w-[58%]">
          <p className="text-lg font-bold text-white">{isReal ? `Tendencia ${period === 'semana' ? 'semanal' : period === 'mes' ? 'mensual' : 'anual'}` : data.trendLabel}</p>
          <div className="mt-4 flex flex-1 items-end justify-between px-2 pb-1">
            {(isReal ? chartLabels : data.chartLabels).map((label, i) => {
              const value = isReal ? realChartValues[i] : 30 + Math.sin((i / ((isReal ? chartLabels : data.chartLabels).length - 1)) * Math.PI) * 60 + 10;
              const max = isReal ? realChartValues.reduce((m, v) => Math.max(m, v), 1) : 1;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-[10px] rounded-full bg-white/20"
                    style={{ height: `${isReal ? (value / max) * 90 + 10 : value}px` }}
                  />
                  <span className="text-sm font-medium text-[#8F8F8F]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historial de pagos */}
      <div className="mt-6 rounded-[24px] border border-[#353535] bg-[#222222] p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-white sm:text-[34px]">Historial de pagos</h2>
          <span className="w-fit rounded-full bg-[#3A3A3A] px-[18px] py-2 text-sm font-semibold text-white">
            {period === 'semana' ? 'Semana' : period === 'mes' ? 'Mes actual' : 'Anual'}
          </span>
        </div>

        <div className="mt-6">
          {period === 'año' ? (
            <div className="space-y-1">
              {(isReal ? realAnnual : annualData).map((group) => (
                <AnnualMonthBlock key={group.month} {...group} />
              ))}
              {isReal && realAnnual.length === 0 && (
                <div className="py-8 text-center text-sm text-[#6B6B6B]">
                  No hay ganancias anuales todavía.
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="border-b border-[#353535] text-left text-[16px] font-medium text-[#8F8F8F]">
                    <th className="pb-3 pr-4 font-medium">Fecha</th>
                    <th className="pb-3 pr-4 font-medium">Pasajero</th>
                    <th className="pb-3 pr-4 font-medium">Ruta</th>
                    <th className="pb-3 text-right font-medium">Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {(isReal ? realPayments : data.payments).map((payment, index) => (
                    <EarningsTableRow key={`${payment.date}-${payment.passenger}-${index}`} {...payment} />
                  ))}
                </tbody>
              </table>
              {isReal && realPayments.length === 0 && (
                <div className="py-8 text-center text-sm text-[#6B6B6B]">
                  No hay pagos en este periodo todavía.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
