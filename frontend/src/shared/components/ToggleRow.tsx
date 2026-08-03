interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

// Fila de configuración con switch, usada en preferencias y ajustes (equivalente a .toggle del mockup).
export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="min-w-0 flex-1">
        <b className="text-[17px] text-white">{label}</b>
        <div className="text-sm leading-snug text-muted">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-7 w-12 flex-none rounded-full transition-colors ${checked ? 'bg-white' : 'bg-surface3'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full transition-all ${
            checked ? 'left-6 bg-black' : 'left-1 bg-[#8F8F8F]'
          }`}
        />
      </button>
    </div>
  );
}
