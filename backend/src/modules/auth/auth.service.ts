import bcrypt from 'bcrypt';

import { appRoleByRoleName, roleNameByAppRole } from '../../shared/utils/roles';
import { signAuthToken } from '../../shared/utils/jwt';
import { HttpError } from '../../shared/utils/http-error';
import crypto from 'crypto';
import { createUser, findRoleByName, findUserByEmail, findUserById, updateUserPassword, updateUserProfile } from './auth.repository';
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, UpdateProfileInput } from './auth.dto';
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

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AuthError('Correo o contraseña incorrectos.', 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AuthError('Correo o contraseña incorrectos.', 401);
  }

  const authUser = toAuthUser(user);
  // El admin puede entrar desde cualquier pestaña del login; para el resto,
  // el rol de la cuenta debe coincidir con el seleccionado.
  if (authUser.role !== 'ADMIN' && authUser.role !== input.role) {
    throw new AuthError('Esta cuenta no está registrada con el rol seleccionado.', 403);
  }

  const token = signAuthToken({ sub: authUser.id, role: authUser.role });
  return { user: authUser, token };
}

export async function getCurrentUser(userId: string): Promise<AuthUser> {
  const user = await findUserById(userId);
  if (!user) {
    throw new AuthError('Usuario no encontrado.', 404);
  }
  return toAuthUser(user);
}

/**
 * Actualiza el perfil del usuario autenticado.
 * Solo modifica los campos enviados (patch parcial).
 */
export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser> {
  const existing = await findUserById(userId);
  if (!existing) {
    throw new AuthError('Usuario no encontrado.', 404);
  }

  const updated = await updateUserProfile(userId, {
    ...(input.firstName !== undefined && { firstName: input.firstName }),
    ...(input.lastNamePaternal !== undefined && { lastNamePaternal: input.lastNamePaternal }),
    ...(input.lastNameMaternal !== undefined && { lastNameMaternal: input.lastNameMaternal }),
    ...(input.phone !== undefined && { phone: input.phone }),
    ...(input.photoUrl !== undefined && { photoUrl: input.photoUrl }),
  });

  return toAuthUser(updated);
}

// Almacena tokens de reset en memoria (en produccion usar Redis o DB)
const resetTokens = new Map<string, { userId: string; expiresAt: number }>();

/**
 * Solicita restablecimiento de contrasena.
 * Genera un token unico y lo almacena con expiracion de 1 hora.
 * En produccion, aqui se enviaria un email con el token.
 */
export async function forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    // Por seguridad, siempre devolver el mismo mensaje aunque el email no exista
    return { message: 'Si el correo esta registrado, recibiras instrucciones para restablecer tu contrasena.' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hora

  resetTokens.set(token, { userId: user.id, expiresAt });

  // En produccion: enviar email con el token
  // await sendPasswordResetEmail(user.email, token);
  console.log(`[Password Reset] Token para ${user.email}: ${token}`);

  return { message: 'Si el correo esta registrado, recibiras instrucciones para restablecer tu contrasena.' };
}

/**
 * Restablece la contrasena usando el token recibido por email.
 * El token expira despues de 1 hora.
 */
export async function resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
  const tokenData = resetTokens.get(input.token);
  if (!tokenData) {
    throw new AuthError('Token invalido o expirado.', 400);
  }

  if (Date.now() > tokenData.expiresAt) {
    resetTokens.delete(input.token);
    throw new AuthError('Token invalido o expirado.', 400);
  }

  const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await updateUserPassword(tokenData.userId, passwordHash);
  resetTokens.delete(input.token);

  return { message: 'Contrasena restablecida correctamente. Ya puedes iniciar sesion.' };
}
