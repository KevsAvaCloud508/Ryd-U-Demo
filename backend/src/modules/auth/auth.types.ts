import type { AppRole } from './auth.dto.js';

export interface AuthUser {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  role: AppRole;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}
