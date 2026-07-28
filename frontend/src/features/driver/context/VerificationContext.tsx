import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface VerificationContextValue {
  submitted: boolean;
  submitDocuments: () => void;
  cancelSubmission: () => void;
}

const VerificationContext = createContext<VerificationContextValue | null>(null);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [submitted, setSubmitted] = useState(false);

  const submitDocuments = useCallback(() => {
    setSubmitted(true);
  }, []);

  const cancelSubmission = useCallback(() => {
    setSubmitted(false);
  }, []);

  const value = useMemo(
    () => ({ submitted, submitDocuments, cancelSubmission }),
    [submitted, submitDocuments, cancelSubmission],
  );

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification(): VerificationContextValue {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification debe usarse dentro de <VerificationProvider>.');
  }
  return context;
}
