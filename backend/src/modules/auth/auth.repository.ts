import { prisma } from '../../prisma/client.js';

const userWithRoles = {
  include: { roles: { include: { role: true } } },
} as const;

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, ...userWithRoles });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, ...userWithRoles });
}

export function findRoleByName(name: string) {
  return prisma.role.findUnique({ where: { name } });
}

export interface CreateUserData {
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
  email: string;
  phone?: string;
  passwordHash: string;
  roleId: number;
}

export function createUser(data: CreateUserData) {
  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastNamePaternal: data.lastNamePaternal,
      lastNameMaternal: data.lastNameMaternal,
      email: data.email,
      phone: data.phone,
      passwordHash: data.passwordHash,
      roles: { create: { roleId: data.roleId } },
    },
    ...userWithRoles,
  });
}

export interface UpdateProfileData {
  firstName?: string;
  lastNamePaternal?: string;
  lastNameMaternal?: string | null;
  phone?: string;
  photoUrl?: string;
}

export function updateUserProfile(id: string, data: UpdateProfileData) {
  return prisma.user.update({
    where: { id },
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastNamePaternal !== undefined && { lastNamePaternal: data.lastNamePaternal }),
      ...(data.lastNameMaternal !== undefined && { lastNameMaternal: data.lastNameMaternal }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
    },
    ...userWithRoles,
  });
}

export function updateUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
    ...userWithRoles,
  });
}
