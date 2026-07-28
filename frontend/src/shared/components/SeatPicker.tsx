import type { ReactNode } from 'react';

type SeatState = 'busy' | 'free' | 'selected';

interface Seat {
  state: SeatState;
  content: ReactNode;
}

interface SeatPickerProps {
  seats: Seat[];
}

const stateClasses: Record<SeatState, string> = {
  busy: 'text-muted2',
  free: 'border-white/35 bg-surface2 text-white',
  selected: 'border-white bg-white text-black',
};

// Selector visual de asientos disponibles (equivalente a .seat del mockup)
export function SeatPicker({ seats }: SeatPickerProps) {
  return (
    <div className="flex justify-center gap-2.5">
      {seats.map((seat, index) => (
        <div
          key={index}
          className={`grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-line text-sm ${stateClasses[seat.state]}`}
        >
          {seat.content}
        </div>
      ))}
    </div>
  );
}
