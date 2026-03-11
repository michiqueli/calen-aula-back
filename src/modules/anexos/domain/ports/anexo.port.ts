import { Anexo } from '../entities/anexo.entity.js';

/**
 * Puerto de dominio para operaciones con anexos.
 */
export interface AnexoPort {
  findAllByUserId(userId: string): Promise<Anexo[]>;
  findById(id: string): Promise<Anexo | null>;
  create(anexo: Partial<Anexo>): Promise<Anexo>;
  update(id: string, data: Partial<Anexo>): Promise<Anexo>;
  delete(id: string): Promise<void>;
  checkDuplicate(numero: number, userId: string): Promise<Anexo | null>;
}

export const ANEXO_PORT = Symbol('ANEXO_PORT');
