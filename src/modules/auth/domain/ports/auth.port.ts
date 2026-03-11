import { User } from '../entities/user.entity.js';

/**
 * Puerto de dominio para operaciones de autenticación.
 */
export interface AuthPort {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}

export const AUTH_PORT = Symbol('AUTH_PORT');
