import type { ReactNode } from 'react';

interface StatusBadgeProps {
  icon: string;
  children: ReactNode;
}

export function StatusBadge({ icon, children }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#252525] px-3 py-1 text-[13px] font-semibold text-[#9A9A9A]">
      <i className={`${icon} text-xs`} />
      {children}
    </span>
  );
}
