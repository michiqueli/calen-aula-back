import { UserPreference } from '../entities/user-preference.entity.js';

/**
 * Puerto de dominio para operaciones de preferencias de usuario.
 */
export interface UserPreferencesPort {
  findByUserId(userId: string): Promise<UserPreference | null>;
  create(data: Partial<UserPreference>): Promise<UserPreference>;
  upsert(userId: string, data: Partial<UserPreference>): Promise<UserPreference>;
}

export const USER_PREFERENCES_PORT = Symbol('USER_PREFERENCES_PORT');
