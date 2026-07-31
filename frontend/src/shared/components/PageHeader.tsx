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
    <div className={`flex items-start justify-between ${compact ? 'pt-[16px]' : 'pt-[38px]'} ${className}`}>
      <div>
        <h1 className="text-[42px] font-extrabold leading-tight tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xl font-medium text-[#8F8F8F]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
