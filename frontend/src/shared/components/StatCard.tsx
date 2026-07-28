import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

// Tarjeta de KPI usada en dashboards (equivalente a .card.kpi del mockup)
export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted">
        {icon}
        {label}
      </div>
      <b className="mt-1 block text-2xl text-white">{value}</b>
    </Card>
  );
}
