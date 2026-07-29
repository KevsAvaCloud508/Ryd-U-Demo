import { useCallback, useEffect, useState } from 'react';

import { ActionButtons, Avatar, PageHeader, StatusBadge } from '../../../shared/components';

type FilterTab = 'pendientes' | 'aceptadas' | 'completadas';

export interface RequestItem {
  id: string;
  name: string;
  initial: string;
  rating: string;
  route: string;
  seats: string;
  seatsNum: number;
  pricePerSeat: number;
  time: string;
  status: FilterTab;
  completedAt?: string;
}

const STORAGE_KEY = 'rydu_driver_requests';
const VERSION_KEY = 'rydu_driver_requests_v';
const DATA_VERSION = 2;

const DEFAULT_REQUESTS: RequestItem[] = [
  // Pendientes — coinciden con las rutas activas
  { id: '1', name: 'Camila García', initial: 'C', rating: '4.9', route: 'Colonia del Valle → UPA', seats: '1 asiento', seatsNum: 1, pricePerSeat: 45, time: '6:45', status: 'pendientes' },
  { id: '2', name: 'Sebastián Herrera', initial: 'S', rating: '4.8', route: 'Fracc. San Ángel → UPA', seats: '2 asientos', seatsNum: 2, pricePerSeat: 50, time: '7:30', status: 'pendientes' },
  { id: '3', name: 'Valentina López', initial: 'V', rating: '5.0', route: 'Las Lomas → UPA', seats: '1 asiento', seatsNum: 1, pricePerSeat: 35, time: '9:00', status: 'pendientes' },
  { id: '4', name: 'Mateo Castillo', initial: 'M', rating: '4.7', route: 'Haciendas del Valle → UPA', seats: '3 asientos', seatsNum: 3, pricePerSeat: 40, time: '12:30', status: 'pendientes' },
  // Aceptadas — esperando completar
  { id: '5', name: 'Isabella Martínez', initial: 'I', rating: '4.9', route: 'Colonia del Valle → UPA', seats: '2 asientos', seatsNum: 2, pricePerSeat: 45, time: '6:45', status: 'aceptadas' },
  { id: '6', name: 'Santiago Pérez', initial: 'S', rating: '4.6', route: 'Las Lomas → UPA', seats: '1 asiento', seatsNum: 1, pricePerSeat: 35, time: '9:00', status: 'aceptadas' },
  // Completadas — aparecen en el historial del dashboard
  { id: '7', name: 'Sofía Ramírez', initial: 'S', rating: '4.9', route: 'Fracc. San Ángel → UPA', seats: '1 asiento', seatsNum: 1, pricePerSeat: 50, time: '7:30', status: 'completadas', completedAt: '2026-07-28' },
  { id: '8', name: 'Nicolás Torres', initial: 'N', rating: '4.5', route: 'Haciendas del Valle → UPA', seats: '2 asientos', seatsNum: 2, pricePerSeat: 40, time: '12:30', status: 'completadas', completedAt: '2026-07-27' },
];

function loadRequests(): RequestItem[] {
  try {
    // Si cambió la versión de datos, limpiar y usar defaults nuevos
    const savedVersion = localStorage.getItem(VERSION_KEY);
    if (savedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as RequestItem[];
  } catch { /* ignore */ }
  localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  return DEFAULT_REQUESTS;
}

export function saveRequests(requests: RequestItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

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

function RequestCard({ request, onAccept, onReject, onComplete }: { request: RequestItem; onAccept?: () => void; onReject?: () => void; onComplete?: () => void }) {
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
        {request.status === 'pendientes' && <ActionButtons size="md" onAccept={onAccept} onReject={onReject} />}
        {request.status === 'aceptadas' && (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-5 py-2 text-sm font-semibold text-[#22c55e] transition-all hover:bg-[#22c55e]/20 hover:border-[#22c55e]/50"
          >
            <i className="bi bi-check2-all mr-1.5" /> Completar viaje
          </button>
        )}
      </div>
    </div>
  );
}

export function DriverRequestsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('pendientes');
  const [requests, setRequests] = useState<RequestItem[]>(loadRequests);

  const persistAndSet = (updater: (prev: RequestItem[]) => RequestItem[]) => {
    setRequests((prev) => {
      const updated = updater(prev);
      saveRequests(updated);
      return updated;
    });
  };

  const handleAccept = (id: string) => {
    persistAndSet((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'aceptadas' as const } : r)),
    );
    setActiveTab('aceptadas');
  };

  const handleReject = (id: string) => {
    persistAndSet((prev) => prev.filter((r) => r.id !== id));
  };

  const handleComplete = (id: string) => {
    persistAndSet((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'completadas' as const, completedAt: new Date().toISOString().split('T')[0] }
          : r,
      ),
    );
    setActiveTab('completadas');
  };

  // Sincronizar cambios entre pestañas
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setRequests(loadRequests());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredRequests = requests.filter((r) => r.status === activeTab);

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
          <RequestCard
            key={req.id}
            request={req}
            onAccept={() => handleAccept(req.id)}
            onReject={() => handleReject(req.id)}
            onComplete={() => handleComplete(req.id)}
          />
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
