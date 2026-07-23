import type { AuthUser, Role } from '../../../shared/types/auth';

export interface RegisterPayload {
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
