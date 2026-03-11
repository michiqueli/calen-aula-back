import { UserAvatar } from '../entities/user-avatar.entity.js';

/**
 * Puerto de dominio para operaciones de avatares de usuario.
 */
export interface UserAvatarsPort {
  findByUserId(userId: string): Promise<UserAvatar | null>;
  upsert(userId: string, data: Partial<UserAvatar>): Promise<UserAvatar>;
}

export const USER_AVATARS_PORT = Symbol('USER_AVATARS_PORT');
