interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  compact?: boolean;
}

export function StatCard({ icon, label, value, compact = false }: StatCardProps) {
  return (
    <div
      className={`rounded-[20px] border border-[#353535] bg-[#222222] ${compact ? 'p-2.5' : 'p-5'}`}
    >
      <div
        className={`flex items-center justify-center rounded-xl bg-[#303030] ${
          compact ? 'h-7 w-7' : 'h-12 w-12'
        }`}
      >
        <i className={`${icon} text-white ${compact ? 'text-sm' : 'text-xl'}`} />
      </div>
      <p
        className={`font-extrabold leading-none tracking-tight text-white ${
          compact ? 'mt-1.5 text-lg' : 'mt-4 text-[34px]'
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-0.5 font-medium text-[#8F8F8F] ${
          compact ? 'text-[10px]' : 'text-[15px]'
        }`}
      >
        {label}
      </p>
    </div>
  );
}
