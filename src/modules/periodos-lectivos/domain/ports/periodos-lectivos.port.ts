import { PeriodoLectivo } from '../entities/periodo-lectivo.entity.js';

/**
 * Puerto de dominio para operaciones sobre periodos lectivos.
 */
export interface PeriodosLectivosPort {
  findAll(): Promise<PeriodoLectivo[]>;
  create(data: Partial<PeriodoLectivo>): Promise<PeriodoLectivo>;
  delete(id: string): Promise<void>;
}

export const PERIODOS_LECTIVOS_PORT = Symbol('PERIODOS_LECTIVOS_PORT');
