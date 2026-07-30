import { api } from '../../../shared/api/axios';
import type { AuthUser } from '../../../shared/types/auth';
import type { AuthResponse, ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, UpdateProfilePayload } from '../types/auth.types';

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>('/auth/me');
  return data.user;
}

export async function updateProfileRequest(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { data } = await api.patch<{ user: AuthUser }>('/auth/profile', payload);
  return data.user;
}

export async function forgotPasswordRequest(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', payload);
  return data;
}

export async function resetPasswordRequest(payload: ResetPasswordPayload): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', payload);
  return data;
}
