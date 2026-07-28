import { useState } from 'react';

import { PageHeader, Segmented } from '../../../shared/components';

type Period = 'semana' | 'mes' | 'año';

interface PaymentRow {
  date: string;
  time: string;
  route: string;
  passengers: number;
  income: string;
}

const periodData: Record<Period, {
  amount: string;
  variation: string;
  trendLabel: string;
  chartLabels: string[];
  payments: PaymentRow[];
}> = {
  semana: {
    amount: '$1,240',
    variation: '+18% vs. semana pasada',
    trendLabel: 'Tendencia semanal',
    chartLabels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    payments: [
      { date: '08 Jul', time: '9:50', route: 'Bosques del Prado → UPA', passengers: 3, income: '+$150' },
      { date: '07 Jul', time: '16:30', route: 'UPA → Centro', passengers: 2, income: '+$120' },
      { date: '05 Jul', time: '7:00', route: 'Bosques del Prado → UPA', passengers: 4, income: '+$200' },
    ],
  },
  mes: {
    amount: '$4,860',
    variation: '+12% vs. mes pasado',
    trendLabel: 'Tendencia mensual',
    chartLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    payments: [
      { date: '08 Jul', time: '9:50', route: 'Bosques del Prado → UPA', passengers: 3, income: '+$150' },
      { date: '01 Jul', time: '7:00', route: 'Bosques del Prado → UPA', passengers: 4, income: '+$200' },
      { date: '28 Jun', time: '16:30', route: 'UPA → Centro', passengers: 2, income: '+$120' },
      { date: '25 Jun', time: '8:00', route: 'Bosques del Prado → UPA', passengers: 3, income: '+$150' },
    ],
  },
  año: {
    amount: '$52,300',
    variation: '+24% vs. año pasado',
    trendLabel: 'Tendencia anual',
    chartLabels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    payments: [
      { date: 'Jul', time: '', route: 'Bosques del Prado → UPA', passengers: 68, income: '+$4,860' },
      { date: 'Jun', time: '', route: 'UPA → Centro', passengers: 52, income: '+$3,920' },
      { date: 'May', time: '', route: 'Bosques del Prado → UPA', passengers: 74, income: '+$5,100' },
    ],
  },
};

function PaymentRow({ date, time, route, passengers, income }: PaymentRow) {
  return (
    <tr className="border-b border-[#353535] last:border-0">
      <td className="py-4 pr-4">
        <span className="font-semibold text-white">{date}</span>
        {time && (
          <>
            <br />
            <span className="text-[15px] text-[#8F8F8F]">{time}</span>
          </>
        )}
      </td>
      <td className="py-4 pr-4 text-[18px] font-medium text-white">{route}</td>
      <td className="py-4 pr-4 text-center text-[18px] font-medium text-white">{passengers}</td>
      <td className="py-4 text-right text-[18px] font-semibold text-white">{income}</td>
    </tr>
  );
}

export function DriverEarningsPage() {
  const [period, setPeriod] = useState<Period>('semana');
  const data = periodData[period];

  const periodOptions: { key: Period; label: string }[] = [
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'año', label: 'Año' },
  ];

  return (
    <div className="px-10 pb-10">
      {/* Header */}
      <PageHeader
        title="Ganancias"
        subtitle="Tus ingresos por viajes compartidos"
        action={
          <Segmented
            size="lg"
            options={periodOptions.map((o) => ({ label: o.label }))}
            activeIndex={periodOptions.findIndex((o) => o.key === period)}
            onSelect={(i) => setPeriod(periodOptions[i].key)}
          />
        }
      />

      {/* Top panels */}
      <div className="mt-8 flex gap-5">
        {/* Income summary card — 42% */}
        <div className="flex w-[42%] flex-col justify-between rounded-[24px] bg-[#F5F5F5] p-7">
          <div>
            <p className="text-[16px] font-medium text-[#6B6B6B]">
              Ingresos {period === 'semana' ? 'de la semana' : period === 'mes' ? 'del mes' : 'del año'}
            </p>
            <p className="mt-1 text-[64px] font-extrabold leading-none tracking-tight text-black">
              {data.amount}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[16px] text-[#6B6B6B]">
              <i className="bi bi-graph-up-arrow text-lg" />
              <span className="font-medium">{data.variation}</span>
            </div>
          </div>
          <button className="mt-6 w-full rounded-full bg-black py-4 text-[18px] font-bold text-white transition-colors hover:bg-black/80">
            Retirar a mi cuenta
          </button>
        </div>

        {/* Trend chart panel — 58% */}
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

      {/* Payment history */}
      <div className="mt-6 rounded-[24px] border border-[#353535] bg-[#222222] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[34px] font-bold text-white">Historial de pagos</h2>
          <span className="rounded-full bg-[#3A3A3A] px-[18px] py-2 text-sm font-semibold text-white">
            Completados
          </span>
        </div>

        <div className="mt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#353535] text-left text-[16px] font-medium text-[#8F8F8F]">
                <th className="pb-3 pr-4 font-medium">Fecha</th>
                <th className="pb-3 pr-4 font-medium">Ruta</th>
                <th className="pb-3 pr-4 text-center font-medium">Pasajeros</th>
                <th className="pb-3 text-right font-medium">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((payment, index) => (
                <PaymentRow key={`${payment.date}-${payment.route}-${index}`} {...payment} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
