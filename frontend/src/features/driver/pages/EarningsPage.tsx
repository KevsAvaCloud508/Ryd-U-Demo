import { useState } from 'react';

import { PageHeader, Segmented } from '../../../shared/components';
import { AnnualMonthBlock, type AnnualMonthGroup } from '../components/AnnualMonthBlock';
import { EarningsTableRow, type EarningsRow } from '../components/EarningsTableRow';
import { useEarnings } from '../hooks/useEarnings';

type Period = 'semana' | 'mes' | 'año';

// ---------------------------------------------------------------------------
// Mock data
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

export function DriverEarningsPage() {
  const [period, setPeriod] = useState<Period>('semana');
  const { totalEarnings, monthlyEarnings, withdraw } = useEarnings();
  const data = periodData[period];

  return (
    <div className="px-10 pb-10">
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
      <div className="mt-8 flex gap-5">
        {/* Income summary card */}
        <div className="flex w-[42%] flex-col justify-between rounded-[24px] bg-[#F5F5F5] p-7">
          <div>
            <p className="text-[16px] font-medium text-[#6B6B6B]">Ingresos totales</p>
            <p className="mt-1 text-[64px] font-extrabold leading-none tracking-tight text-black">
              {formatCurrency(totalEarnings)}
            </p>
          </div>

          <button
            onClick={withdraw}
            disabled={totalEarnings === 0}
            className="mt-6 w-full rounded-full bg-black py-4 text-[18px] font-bold text-white transition-all hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {totalEarnings === 0 ? 'Sin fondos para retirar' : 'Retirar a mi cuenta'}
          </button>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#353535] bg-white/10 px-5 py-4">
            <div>
              <p className="text-[13px] font-medium text-[#6B6B6B]">Ganancias totales del mes</p>
              <p className="mt-0.5 text-[22px] font-extrabold tracking-tight text-black">
                {formatCurrency(monthlyEarnings)}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-[13px] text-green-700">
                <i className="bi bi-graph-up-arrow text-sm text-green-600" />
                <span className="font-medium">+12% vs. mes anterior</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10">
              <i className="bi bi-calendar-month text-xl text-black" />
            </div>
          </div>
        </div>

        {/* Trend chart panel */}
        <div className="flex w-[58%] flex-col rounded-[24px] border border-[#353535] bg-[#222222] p-[26px]">
          <p className="text-lg font-bold text-white">{data.trendLabel}</p>
          <div className="mt-4 flex flex-1 items-end justify-between px-2 pb-1">
            {data.chartLabels.map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-[10px] rounded-full bg-white/20"
                  style={{
                    height: `${30 + Math.sin((i / (data.chartLabels.length - 1)) * Math.PI) * 60 + 10}px`,
                  }}
                />
                <span className="text-sm font-medium text-[#8F8F8F]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historial de pagos */}
      <div className="mt-6 rounded-[24px] border border-[#353535] bg-[#222222] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[34px] font-bold text-white">Historial de pagos</h2>
          <span className="rounded-full bg-[#3A3A3A] px-[18px] py-2 text-sm font-semibold text-white">
            {period === 'semana' ? 'Semana' : period === 'mes' ? 'Mes actual' : 'Anual'}
          </span>
        </div>

        <div className="mt-6">
          {period === 'año' ? (
            <div className="space-y-1">
              {annualData.map((group) => (
                <AnnualMonthBlock key={group.month} {...group} />
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#353535] text-left text-[16px] font-medium text-[#8F8F8F]">
                  <th className="pb-3 pr-4 font-medium">Fecha</th>
                  <th className="pb-3 pr-4 font-medium">Pasajero</th>
                  <th className="pb-3 pr-4 font-medium">Ruta</th>
                  <th className="pb-3 text-right font-medium">Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((payment, index) => (
                  <EarningsTableRow key={`${payment.date}-${payment.passenger}-${index}`} {...payment} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
