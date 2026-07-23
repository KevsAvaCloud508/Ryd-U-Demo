import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux';
import type { Role } from '../../../shared/types/auth';
import { logout, registerUser } from '../store/auth.slice';
import type { RegisterPayload } from '../types/auth.types';

// Punto único de acceso al estado y las acciones de autenticación desde cualquier componente.
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, status, error, isInitializing } = useAppSelector((state) => state.auth);

  const register = useCallback(
    (payload: RegisterPayload) => dispatch(registerUser(payload)).unwrap(),
    [dispatch],
  );

  const signOut = useCallback(() => dispatch(logout()), [dispatch]);

  return {
    user,
    role: user?.role as Role | undefined,
    isAuthenticated: Boolean(user),
    isLoading: status === 'loading',
    isInitializing,
    error,
    register,
    logout: signOut,
  };
}
