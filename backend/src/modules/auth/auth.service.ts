import bcrypt from 'bcrypt';

import { appRoleByRoleName, roleNameByAppRole } from '../../shared/utils/roles';
import { signAuthToken } from '../../shared/utils/jwt';
import { HttpError } from '../../shared/utils/http-error';
import { createUser, findRoleByName, findUserByEmail } from './auth.repository';
import type { RegisterInput } from './auth.dto';
import type { AuthResult, AuthUser } from './auth.types';

const SALT_ROUNDS = 10;

type UserWithRoles = NonNullable<Awaited<ReturnType<typeof findUserByEmail>>>;

// Alias por compatibilidad semántica: en el módulo de auth los HttpError se leen como "AuthError".
export const AuthError = HttpError;

// Un usuario puede tener más de un rol asignado en `usuariorol`, pero esta app
// solo permite operar con uno a la vez: se usa el primero que Ryd-U reconozca.
function resolvePrimaryRole(user: UserWithRoles): AuthUser['role'] {
  // El rol Administrador tiene prioridad sobre cualquier otro asignado.
  if (user.roles.some(({ role }) => appRoleByRoleName[role.name] === 'ADMIN')) {
    return 'ADMIN';
  }
  for (const { role } of user.roles) {
    const appRole = appRoleByRoleName[role.name];
    if (appRole) return appRole;
  }
  throw new AuthError('El usuario no tiene un rol válido asignado.', 403);
}

function toAuthUser(user: UserWithRoles): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastNamePaternal: user.lastNamePaternal,
    lastNameMaternal: user.lastNameMaternal,
    fullName: [user.firstName, user.lastNamePaternal, user.lastNameMaternal].filter(Boolean).join(' '),
    email: user.email ?? '',
    phone: user.phone,
    photoUrl: user.photoUrl,
    role: resolvePrimaryRole(user),
  };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new AuthError('Ya existe una cuenta registrada con este correo.', 409);
  }

  const roleName = roleNameByAppRole[input.role];
  const role = await findRoleByName(roleName);
  if (!role) {
    throw new AuthError(`El rol "${roleName}" no está configurado en la base de datos.`, 500);
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await createUser({
    firstName: input.firstName,
    lastNamePaternal: input.lastNamePaternal,
    lastNameMaternal: input.lastNameMaternal,
    email: input.email,
    phone: input.phone,
    passwordHash,
    roleId: role.id,
  });

  const authUser = toAuthUser(user);
  const token = signAuthToken({ sub: authUser.id, role: authUser.role });
  return { user: authUser, token };
}
