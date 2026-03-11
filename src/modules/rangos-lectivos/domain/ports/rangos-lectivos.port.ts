import { RangoLectivo } from '../entities/rango-lectivo.entity.js';

/**
 * Puerto de dominio para operaciones sobre rangos lectivos.
 */
export interface RangosLectivosPort {
  findAll(): Promise<RangoLectivo[]>;
  create(data: Partial<RangoLectivo>): Promise<RangoLectivo>;
  update(id: string, data: Partial<RangoLectivo>): Promise<RangoLectivo>;
  delete(id: string): Promise<void>;
}

export const RANGOS_LECTIVOS_PORT = Symbol('RANGOS_LECTIVOS_PORT');
