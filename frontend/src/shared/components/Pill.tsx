import type { HTMLAttributes, ReactNode } from 'react';

type PillVariant = 'white' | 'dark' | 'outline';

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<PillVariant, string> = {
  white: 'bg-white text-black',
  dark: 'bg-surface3 text-[#e5e5ea]',
  outline: 'bg-transparent border border-line text-muted',
};

// Etiqueta pequeña 
export function Pill({ variant = 'dark', children, className = '', ...rest }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
