import type { ReactNode } from 'react';

interface SegmentedOption {
  label: string;
  icon?: ReactNode;
}

interface SegmentedProps {
  options: SegmentedOption[];
  activeIndex: number;
  onSelect?: (index: number) => void;
  className?: string;
}

// Selector tipo "segmented control"
export function Segmented({ options, activeIndex, onSelect, className = '' }: SegmentedProps) {
  return (
    <div className={`inline-flex gap-1 rounded-full border border-line bg-surface p-1 ${className}`}>
      {options.map((option, index) => (
        <div
          key={option.label}
          role={onSelect ? 'button' : undefined}
          onClick={onSelect ? () => onSelect(index) : undefined}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-bold ${
            onSelect ? 'cursor-pointer' : ''
          } ${index === activeIndex ? 'bg-white text-black' : 'text-muted'}`}
        >
          {option.icon}
          {option.label}
        </div>
      ))}
    </div>
  );
}
