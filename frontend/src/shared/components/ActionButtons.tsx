interface ActionButtonsProps {
  size?: 'sm' | 'md';
  className?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

const sizeClasses = {
  sm: { button: 'h-10 w-10 text-sm', icon: 'text-base' },
  md: { button: 'h-12 w-12 text-base', icon: 'text-lg' },
};

export function ActionButtons({ size = 'md', className = '', onAccept, onReject }: ActionButtonsProps) {
  const s = sizeClasses[size];

  return (
    <div className={`flex items-center gap-[10px] ${className}`}>
      <button
        type="button"
        onClick={onReject}
        className={`${s.button} flex items-center justify-center rounded-full border border-[#353535] bg-transparent text-white transition-colors hover:bg-white/10 hover:border-red-500 hover:text-red-400`}
      >
        <i className={`bi bi-x ${s.icon}`} />
      </button>
      <button
        type="button"
        onClick={onAccept}
        className={`${s.button} flex items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/90`}
      >
        <i className={`bi bi-check ${s.icon}`} />
      </button>
    </div>
  );
}
