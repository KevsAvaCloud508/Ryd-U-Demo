import { ActionButtons, Avatar, PageHeader, StatCard, StatusBadge } from '../../../shared/components';

interface TripRowProps {
  date: string;
  time: string;
  route: string;
  passengers: number;
  status: string;
  income: string;
}

function TripRow({ date, time, route, passengers, status, income }: TripRowProps) {
  return (
    <tr className="border-b border-[#353535] last:border-0">
      <td className="py-4 pr-4">
        <span className="font-semibold text-white">{date}</span>
        <br />
        <span className="text-[15px] text-[#8F8F8F]">{time}</span>
      </td>
      <td className="py-4 pr-4 text-[15px] text-white">{route}</td>
      <td className="py-4 pr-4 text-center text-[15px] text-white">{passengers}</td>
      <td className="py-4 pr-4">
        <StatusBadge icon="bi bi-check-circle">{status}</StatusBadge>
      </td>
      <td className="py-4 text-right font-semibold text-white">{income}</td>
    </tr>
  );
}

interface RequestCardProps {
  initial: string;
  name: string;
  rating: string;
  seats: string;
}

function RequestCard({ initial, name, rating, seats }: RequestCardProps) {
  return (
    <div className="rounded-[20px] border border-[#353535] bg-[#1F1F1F] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#303030] text-lg font-bold text-white">
            {initial}
          </div>
          <div>
            <p className="font-bold text-white">{name}</p>
            <div className="flex items-center gap-1 text-sm text-[#8F8F8F]">
              <i className="bi bi-star-fill text-xs text-white/80" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
        <span className="rounded-full border border-[#353535] px-3 py-0.5 text-[13px] text-[#8F8F8F]">
          {seats}
        </span>
      </div>
      <ActionButtons size="sm" className="mt-4" />
    </div>
  );
}

const trips: TripRowProps[] = [
  { date: '08 Jul', time: '9:50', route: 'Bosques del Prado → UPA', passengers: 3, status: 'Completado', income: '+$150' },
  { date: '07 Jul', time: '16:30', route: 'UPA → Centro', passengers: 2, status: 'Completado', income: '+$120' },
  { date: '05 Jul', time: '7:00', route: 'Bosques del Prado → UPA', passengers: 4, status: 'Completado', income: '+$200' },
];

const requests: RequestCardProps[] = [
  { initial: 'E', name: 'Edward B.', rating: '4.9', seats: '1 asiento' },
  { initial: 'A', name: 'Ana L.', rating: '5.0', seats: '1 asiento' },
];

export function DriverDashboardPage() {
  return (
    <div className="px-10 pb-10">
      {/* Header */}
      <PageHeader title="Hola, Juan" subtitle="Resumen de tu actividad como conductor" action={<Avatar initial="J" size={56} variant="solid" />} />

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-4 gap-5">
        <StatCard icon="bi bi-cash-stack" label="Ganado (semana)" value="$1,240" />
        <StatCard icon="bi bi-star" label="Rating" value="4.8" />
        <StatCard icon="bi bi-route" label="Viajes" value="86" />
        <StatCard icon="bi bi-people" label="Rutas activas" value="2" />
      </div>

      {/* Bottom section */}
      <div className="mt-8 flex gap-5">
        {/* Trip History */}
        <div className="flex-[65%]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Historial de viajes</h2>
            <StatusBadge icon="bi bi-person-fill">Conductor</StatusBadge>
          </div>
          <div className="rounded-[18px] border border-[#353535] bg-[#222222] p-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#353535] text-left text-sm font-medium text-[#9A9A9A]">
                  <th className="pb-3 pr-4 font-medium">Fecha</th>
                  <th className="pb-3 pr-4 font-medium">Ruta</th>
                  <th className="pb-3 pr-4 text-center font-medium">Pasajeros</th>
                  <th className="pb-3 pr-4 font-medium">Estado</th>
                  <th className="pb-3 text-right font-medium">Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <TripRow key={`${trip.date}-${trip.time}`} {...trip} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="flex-[35%]">
          <h2 className="mb-4 text-lg font-bold text-white">Solicitudes nuevas</h2>
          <div className="flex flex-col gap-[14px]">
            {requests.map((req) => (
              <RequestCard key={req.name} {...req} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
