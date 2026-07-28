interface SegmentedOption {
  label: string;
}

interface SegmentedProps {
  size?: 'md' | 'lg';
  options: SegmentedOption[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

const sizeClasses = {
  md: { container: 'rounded-[14px] p-1', button: 'px-4 py-2 text-sm' },
  lg: { container: 'rounded-[18px] p-1.5', button: 'px-6 py-2.5 text-[15px]' },
};

export function Segmented({ size = 'md', options, activeIndex, onSelect, className = '' }: SegmentedProps) {
  const s = sizeClasses[size];

  return (
    <div className={`flex gap-1 bg-[#1A1A1A] ${s.container} ${className}`}>
      {options.map((option, index) => (
        <button
          key={option.label}
          type="button"
          onClick={() => onSelect(index)}
          className={`rounded-[14px] font-bold transition-all ${
            index === activeIndex
              ? 'bg-white text-black'
              : 'text-[#8C8C8C] hover:text-white/70'
          } ${s.button}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
