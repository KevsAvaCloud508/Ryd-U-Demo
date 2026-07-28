import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  status?: ReactNode;
}

// Menú lateral usado en las vistas del conductor (equivalente a .side del mockup)
export function Sidebar({ items, status }: SidebarProps) {
  return (
    <div className="flex flex-col gap-1 border-r border-line p-4 pt-[22px]">
      <img className="mb-3 h-6 w-auto" src="/logo.svg" alt="RydU" />
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className={`flex items-center gap-[11px] rounded-xl px-[13px] py-[11px] text-sm font-semibold ${
            item.active ? 'bg-white text-black' : 'text-muted'
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
      {status && <div className="mt-5">{status}</div>}
    </div>
  );
}
