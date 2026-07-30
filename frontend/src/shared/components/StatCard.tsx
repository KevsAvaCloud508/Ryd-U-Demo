interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-[20px] border border-[#353535] bg-[#222222] p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#303030]">
        <i className={`${icon} text-xl text-white`} />
      </div>
      <p className="mt-4 text-[34px] font-extrabold leading-none tracking-tight text-white">
        {value}
      </p>
      <p className="mt-1 text-[15px] font-medium text-[#8F8F8F]">
        {label}
      </p>
    </div>
  );
}
