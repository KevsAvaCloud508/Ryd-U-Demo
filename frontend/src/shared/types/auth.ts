export type Role = 'STUDENT' | 'DRIVER';

export interface AuthUser {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  role: Role;
}
