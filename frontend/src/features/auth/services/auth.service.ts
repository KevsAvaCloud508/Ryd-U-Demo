import { api } from '../../../shared/api/axios';
import type { AuthResponse, RegisterPayload } from '../types/auth.types';

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
}
