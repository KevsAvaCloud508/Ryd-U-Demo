import type { ReactNode } from 'react';

interface InputFieldProps {
  icon: ReactNode;
  value: ReactNode;
  focused?: boolean;
  trailing?: ReactNode;
  className?: string;
}

// Campo de texto de solo lectura visual
export function InputField({ icon, value, focused = false, trailing, className = '' }: InputFieldProps) {
  return (
    <div
      className={`flex items-center gap-[9px] rounded-xl border px-3.5 py-3 text-sm text-[#e5e5ea] ${
        focused ? 'border-white/40 bg-surface2' : 'border-line bg-surface'
      } ${className}`}
    >
      <span className="text-muted">{icon}</span>
      <span className="flex-1">{value}</span>
      {trailing}
    </div>
  );
}

// Etiqueta pequeña sobre un input
export function FieldLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`my-[14px] mb-1.5 text-xs font-semibold text-muted ${className}`}>{children}</div>;
}
