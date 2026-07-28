interface StopRowProps {
  label: string;
  time: string;
  active?: boolean;
}

// Parada dentro del listado de ruta (equivalente a .stop del mockup)
export function StopRow({ label, time, active = false }: StopRowProps) {
  return (
    <div className="flex items-center justify-between py-[7px] text-[13px] text-[#e5e5ea]">
      <span className="flex items-center">
        <span
          className={`mr-2.5 inline-block h-3 w-3 flex-none rounded-full border-2 ${
            active ? 'border-white bg-white' : 'border-muted'
          }`}
        />
        {label}
      </span>
      <span className="text-muted">{time}</span>
    </div>
  );
}
