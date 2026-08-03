import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Atrapa errores de render de cualquier página y muestra el mensaje en pantalla
// en lugar de dejar la aplicación en blanco (ayuda a diagnosticar y evita
// una experiencia rota silenciosa).
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black p-8">
          <div className="w-full max-w-md rounded-2xl border border-red-400/30 bg-surface p-6 text-center">
            <i className="bi bi-exclamation-triangle text-3xl text-red-400" />
            <h1 className="mt-3 text-lg font-extrabold text-white">Algo salió mal</h1>
            <p className="mt-2 break-words text-sm text-muted">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-bold text-black"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
