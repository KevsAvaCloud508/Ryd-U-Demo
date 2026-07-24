import { prisma } from '../../prisma/client';

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
