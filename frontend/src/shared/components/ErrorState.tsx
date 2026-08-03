import { Card } from './Card';

interface ErrorStateProps {
  message: string;
  className?: string;
}

// Tarjeta de error reutilizable.
export function ErrorState({ message, className = '' }: ErrorStateProps) {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <i className="bi bi-exclamation-triangle text-3xl text-muted" />
      <p className="mt-2 text-sm text-muted">{message}</p>
    </Card>
  );
}
