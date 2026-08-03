import { useState, type ReactNode } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-black/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-6 sm:px-7">
        <img className="h-6 w-auto" src="/logo.svg" alt="RydU" />
        <nav className="hidden gap-5 text-sm font-semibold text-muted md:flex">
          {links.map((link) => (
            <Link key={link.label} to={link.href} className={link.active ? 'text-white' : 'hover:text-white/70'}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 sm:gap-4">{right}</div>
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'} text-xl`} />
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav className="border-t border-line px-4 pb-3 pt-2 md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                link.active ? 'bg-white/10 text-white' : 'text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
