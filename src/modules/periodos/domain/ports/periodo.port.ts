import { Periodo } from '../entities/periodo.entity.js';

/**
 * Puerto de dominio para operaciones con periodos.
 */
export interface PeriodoPort {
  findAllByUserId(userId: string): Promise<Periodo[]>;
  findByAnexoId(anexoId: string): Promise<Periodo[]>;
  findByNombreAndUserId(nombre: string, userId: string): Promise<Periodo | null>;
  create(periodo: Partial<Periodo>): Promise<Periodo>;
  createBulk(periodos: Partial<Periodo>[]): Promise<Periodo[]>;
  delete(id: string): Promise<void>;
}

export const PERIODO_PORT = Symbol('PERIODO_PORT');
