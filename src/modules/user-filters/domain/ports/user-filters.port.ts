import { UserFilter } from '../entities/user-filter.entity.js';

/**
 * Puerto de dominio para operaciones de filtros de visualización de usuario.
 */
export interface UserFiltersPort {
  findByUserId(userId: string): Promise<UserFilter | null>;
  upsert(userId: string, data: Partial<UserFilter>): Promise<UserFilter>;
}

export const USER_FILTERS_PORT = Symbol('USER_FILTERS_PORT');
