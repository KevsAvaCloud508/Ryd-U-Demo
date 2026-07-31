interface LoadingStateProps {
  label?: string;
  className?: string;
}

// Estado de carga centrado con spinner.
export function LoadingState({ label = 'Cargando…', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center py-16 text-sm text-muted ${className}`}>
      <i className="bi bi-arrow-repeat mr-2 animate-spin" /> {label}
    </div>
  );
}
