import { FechaImportanteAnexo } from '../entities/fecha-importante-anexo.entity.js';

/**
 * Puerto de dominio para operaciones con fechas importantes de anexos.
 */
export interface FechaImportantePort {
  findByAnexoId(anexoId: string): Promise<FechaImportanteAnexo[]>;
  create(fecha: Partial<FechaImportanteAnexo>): Promise<FechaImportanteAnexo>;
  createBulk(fechas: Partial<FechaImportanteAnexo>[]): Promise<FechaImportanteAnexo[]>;
  update(id: string, data: Partial<FechaImportanteAnexo>): Promise<FechaImportanteAnexo>;
  delete(id: string): Promise<void>;
  countByPeriodoId(periodoId: string): Promise<number>;
}

export const FECHA_IMPORTANTE_PORT = Symbol('FECHA_IMPORTANTE_PORT');
