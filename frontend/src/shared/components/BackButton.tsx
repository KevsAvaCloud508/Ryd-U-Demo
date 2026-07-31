import { Link } from 'react-router-dom';

interface BackButtonProps {
  to: string;
  label?: string;
}

// Enlace de regreso con marco, usado en las subpáginas de perfil para volver al menú principal.
export function BackButton({ to, label = 'Volver' }: BackButtonProps) {
  return (
    <Link
      to={to}
      className="mt-[30px] mb-[14px] inline-flex items-center gap-2 rounded-full border border-[#454545] bg-[#222222] px-[18px] py-[10px] text-sm font-bold text-white transition-colors hover:bg-[#2c2c2e]"
    >
      <i className="bi bi-arrow-left text-base" />
      {label}
    </Link>
  );
}
