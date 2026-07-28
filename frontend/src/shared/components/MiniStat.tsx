interface MiniStatProps {
  value: string;
  label: string;
}

export function MiniStat({ value, label }: MiniStatProps) {
  return (
    <div className="flex flex-col items-center rounded-[18px] border border-[#353535] bg-[#252525] px-6 py-4">
      <span className="text-[26px] font-extrabold leading-none text-white">{value}</span>
      <span className="mt-1 text-sm font-medium text-[#9A9A9A]">{label}</span>
    </div>
  );
}
