import { useState } from 'react';

import { Button, IconInput, PageHeader } from '../../../shared/components';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;
const DEFAULT_DAYS = new Set([0, 1, 2, 3, 4]);

export function DriverPublishRoutePage() {
  const [origin, setOrigin] = useState('');
  const [destination] = useState('Universidad Politécnica (UPA)');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats] = useState('4');
  const [price] = useState('$50');
  const [selectedDays, setSelectedDays] = useState<Set<number>>(DEFAULT_DAYS);

  const toggleDay = (index: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handlePublish = () => {
    // TODO: conectar con API cuando esté lista
  };

  return (
    <div className="flex min-h-0 flex-1">
      {/* Left — Form */}
      <div className="flex flex-1 flex-col px-4 pb-10 pt-[30px] sm:px-6 lg:px-10 lg:pt-[38px]">
        <PageHeader title="Publicar ruta" subtitle="Comparte tu trayecto y genera un ingreso extra" />

        {/* Form grid */}
        <div className="mt-10 grid max-w-[680px] grid-cols-1 gap-x-5 gap-y-[18px] sm:grid-cols-2">
          <IconInput
            icon="bi bi-circle"
            label="Origen"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />

          <IconInput
            icon="bi bi-geo-alt"
            label="Destino"
            type="text"
            value={destination}
            readOnly
          />

          <IconInput
            icon="bi bi-calendar3"
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="[&::-webkit-calendar-picker-indicator]:invert"
          />

          <IconInput
            icon="bi bi-clock"
            label="Hora de salida"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="[&::-webkit-calendar-picker-indicator]:invert"
          />

          <IconInput
            icon="bi bi-people"
            label="Asientos disponibles"
            type="text"
            value={seats}
            readOnly
          />

          <IconInput
            icon="bi bi-wallet2"
            label="Precio por asiento"
            type="text"
            value={price}
            readOnly
          />
        </div>

        {/* Días recurrentes */}
        <div className="mt-8">
          <label className="text-[16px] font-semibold text-[#A0A0A0]">Días recurrentes</label>
          <div className="mt-3 flex flex-wrap gap-3">
            {DAYS.map((day, index) => {
              const isSelected = selectedDays.has(index);
              return (
                <button
                  key={`${day}-${index}`}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-black'
                      : 'border border-[#353535] bg-transparent text-[#6B6B6B] hover:border-white/50 hover:text-white/70'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Publish button */}
        <div className="mt-10">
          <Button
            onClick={handlePublish}
            className="rounded-full bg-white px-10 py-4 text-xl font-bold text-black hover:bg-white/90"
          >
            Publicar ruta
            <i className="bi bi-arrow-right ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
