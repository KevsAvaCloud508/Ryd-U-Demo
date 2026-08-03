import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function PageHeader({ title, subtitle, action, className = '', compact = false }: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${
        compact ? 'pt-[16px]' : 'pt-[38px]'
      } ${className}`}
    >
      <div className="min-w-0">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-white sm:text-[34px] lg:text-[42px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-base font-medium text-[#8F8F8F] sm:text-lg lg:text-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
    </div>
  );
}
