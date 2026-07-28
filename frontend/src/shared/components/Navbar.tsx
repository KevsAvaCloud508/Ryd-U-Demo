import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavLinkItem {
  label: string;
  href: string;
  active?: boolean;
}

interface NavbarProps {
  links: NavLinkItem[];
  right?: ReactNode;
}

// Barra de navegación superior compartida (equivalente a .nav del mockup)
export function Navbar({ links, right }: NavbarProps) {
  return (
    <div className="flex h-16 items-center gap-6 border-b border-line px-7">
      <img className="h-6 w-auto" src="/logo.svg" alt="RydU" />
      <div className="flex gap-5 text-sm font-semibold text-muted">
        {links.map((link) => (
          <Link key={link.label} to={link.href} className={link.active ? 'text-white' : ''}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-4">{right}</div>
    </div>
  );
}
