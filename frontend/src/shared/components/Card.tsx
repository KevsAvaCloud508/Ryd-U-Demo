import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  dashed?: boolean;
  inverted?: boolean;
}

// Contenedor base 
export function Card({ children, dashed = false, inverted = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[18px] border ${dashed ? 'border-dashed' : ''} ${
        inverted ? 'border-transparent bg-white text-black' : 'border-line bg-surface'
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
