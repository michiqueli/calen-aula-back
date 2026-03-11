import { UserRole } from '../entities/user-role.entity.js';

/**
 * Puerto de dominio para operaciones de roles de usuario.
 */
export interface UsersRolesPort {
  findByUserId(userId: string): Promise<UserRole | null>;
}

export const USERS_ROLES_PORT = Symbol('USERS_ROLES_PORT');
