import { useState } from 'react';

import { ActionButtons, Avatar, PageHeader, StatusBadge } from '../../../shared/components';

type FilterTab = 'pendientes' | 'aceptadas' | 'completadas';

interface RequestItem {
  id: string;
  name: string;
  initial: string;
  rating: string;
  route: string;
  seats: string;
  time: string;
  status: FilterTab;
}

const allRequests: RequestItem[] = [
  { id: '1', name: 'Edward B.', initial: 'E', rating: '4.9', route: 'Bosques del Prado → UPA', seats: '1 asiento', time: '9:50 AM', status: 'pendientes' },
  { id: '2', name: 'Ana L.', initial: 'A', rating: '5.0', route: 'Centro → UPA', seats: '2 asientos', time: '10:30 AM', status: 'pendientes' },
  { id: '3', name: 'Carlos M.', initial: 'C', rating: '4.7', route: 'Las Flores → UPA', seats: '1 asiento', time: '11:00 AM', status: 'pendientes' },
  { id: '4', name: 'María G.', initial: 'M', rating: '4.8', route: 'Bosques del Prado → UPA', seats: '1 asiento', time: '9:50 AM', status: 'aceptadas' },
  { id: '5', name: 'Luis R.', initial: 'L', rating: '4.9', route: 'Centro → UPA', seats: '2 asientos', time: '10:30 AM', status: 'aceptadas' },
  { id: '6', name: 'Sofía P.', initial: 'S', rating: '4.6', route: 'Las Flores → UPA', seats: '1 asiento', time: '16:00 PM', status: 'completadas' },
  { id: '7', name: 'Diego H.', initial: 'D', rating: '4.9', route: 'Bosques del Prado → UPA', seats: '1 asiento', time: '7:00 AM', status: 'completadas' },
];

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'aceptadas', label: 'Aceptadas' },
  { key: 'completadas', label: 'Completadas' },
];

const statusConfig = {
  pendientes: { icon: 'bi bi-clock', label: 'Pendiente' },
  aceptadas: { icon: 'bi bi-check-circle', label: 'Aceptada' },
  completadas: { icon: 'bi bi-check2-all', label: 'Completada' },
};

function RequestCard({ request }: { request: RequestItem }) {
  return (
    <div className="rounded-[20px] border border-[#353535] bg-[#1F1F1F] p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar initial={request.initial} size={44} variant="solid" />
          <div>
            <p className="text-lg font-bold text-white">{request.name}</p>
            <div className="flex items-center gap-1 text-sm text-[#8F8F8F]">
              <i className="bi bi-star-fill text-xs text-white/80" />
              <span>{request.rating}</span>
              <span className="mx-1.5">·</span>
              <i className="bi bi-clock text-xs" />
              <span>{request.time}</span>
            </div>
          </div>
        </div>
        <StatusBadge icon={statusConfig[request.status].icon}>
          {statusConfig[request.status].label}
        </StatusBadge>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[15px] text-[#CFCFCF]">
        <i className="bi bi-geo-alt text-[#8F8F8F]" />
        <span>{request.route}</span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full border border-[#353535] px-4 py-1 text-sm font-medium text-[#8F8F8F]">
          {request.seats}
        </span>
        {request.status === 'pendientes' && <ActionButtons size="md" />}
        {request.status === 'aceptadas' && (
          <button
            type="button"
            className="rounded-full border border-[#353535] px-5 py-2 text-sm font-semibold text-[#8F8F8F] transition-colors hover:border-white/50 hover:text-white"
          >
            Ver detalle
          </button>
        )}
      </div>
    </div>
  );
}

export function DriverRequestsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('pendientes');

  const filteredRequests = allRequests.filter((r) => r.status === activeTab);

  return (
    <div className="px-10 pb-10">
      <PageHeader
        title="Solicitudes"
        subtitle="Revisa y gestiona las solicitudes de viaje"
      />

      {/* Filter tabs */}
      <div className="mt-8 flex gap-2 rounded-[18px] bg-[#1A1A1A] p-1.5 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-[14px] px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-black'
                : 'text-[#8C8C8C] hover:text-white/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {filteredRequests.map((req) => (
          <RequestCard key={req.id} request={req} />
        ))}
        {filteredRequests.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#353535] py-16">
            <i className="bi bi-inbox text-5xl text-[#4A4A4A]" />
            <p className="mt-4 text-lg font-medium text-[#6B6B6B]">
              No hay solicitudes {activeTab}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
